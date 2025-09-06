import { createFilterHandler } from '../core/handlers/filter';
import { mediaGroup } from 'grammy-media-group';
import { InputMediaDocument, Message } from 'grammy/types';
import { IAlignments, parseAlignCommands } from '../actions/watermark/align';
import { createWatermark } from '../actions/watermark/createTWatermark';
import { createOverlay } from '../actions/watermark/createOverlay';
import { getMultiplePhotoLinks } from '../processes/get-photolink';
import { parseInput } from '../shared/helpers/parse-input';
import { AIService } from '../services/AI';
import patchTranslator from '../services/AI/prompts/patch-translator';
import { fetchImageAsBase64 } from '../shared/helpers/base64';
import { has } from '../shared/helpers/object-has';
import { InputFile } from 'grammy';

type MediaGroup = (Message.PhotoMessage | Message.VideoMessage)[];

function isOnlyPhotoGroup(media_group: MediaGroup) {
  return media_group.every(
    (msg): msg is Message.PhotoMessage => "photo" in msg
  );
}

type ImageProcessor = (link: string, aligns?: IAlignments) => Promise<Buffer>;

const defaultProcessor: ImageProcessor = async (link, aligns) => {
  const image = await createWatermark(await createOverlay(link), {
    ...aligns
  });
  return image.getBuffer('image/png');
};

const processors: Record<string, ImageProcessor> = {
  '/overlay': async (link) =>
    createOverlay(link).then(img => img.getBuffer('image/png')),

  '/watermark': async (link, aligns) =>
    createWatermark(link, aligns).then(img => img.getBuffer('image/png')),

  '/twatermark': defaultProcessor
};

export default createFilterHandler(mediaGroup, async (context) => {
  const medias = context.media_group;

  if (!isOnlyPhotoGroup(medias)) {
    return context.reply('Только изображения!');
  }

  const photos = medias.map(v => v.photo);

  const links = await getMultiplePhotoLinks(photos);

  const caption = medias[0].caption || '';

  const { command, args } = parseInput(caption);

  if (command === '/patch') {
    const ai = new AIService(process.env.AI_SERVICE_KEY, {scenario: patchTranslator});
    const base64images = await Promise.all(links.map((v) => fetchImageAsBase64(v, 'image/jpeg')));
    const data = await ai.sendImages(base64images, args.join(' '));
    const response = ai.readResponse(data);

    return context.reply(response);
  }

  await context.reply('Создание изображении...');

  const output: InputMediaDocument[] = [];
  const processor = processors[command ?? ''] ?? defaultProcessor;

  const aligns = await parseAlignCommands(args);

  if (has(aligns, 'error')) return context.reply('Ошибка вычисления координат вотермарки');

  for (const link of links) {
    const buffer = await processor(link, aligns);

    output.push({
      type: 'document',
      media: new InputFile(buffer, 'photo.png'),
    });
  }

  await context.replyWithMediaGroup(output);
});