import { createFilterHandler } from '../core/handlers/filter';
import { mediaGroup } from 'grammy-media-group';
import { InputMediaDocument, Message } from 'grammy/types';
import { parseAlignCommands } from '../actions/watermark/align';
import { getMultiplePhotoLinks } from '../processes/get-photolink';
import { parseInput } from '../shared/helpers/parse-input';
import { AIService } from '../services/AI';
import patchTranslator from '../services/AI/prompts/patch-translator';
import { fetchImageAsBase64 } from '../shared/helpers/base64';
import { has } from '../shared/helpers/object-has';
import { InputFile } from 'grammy';
import {
  defaultWatermarkProcessor,
  watermarkProcessors,
} from '../actions/watermark/processors';

type MediaGroup = (Message.PhotoMessage | Message.VideoMessage)[];

function isOnlyPhotoGroup(media_group: MediaGroup) {
  return media_group.every(
    (msg): msg is Message.PhotoMessage => "photo" in msg
  );
}

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

  const processorKey = (command ?? '').replace('/', '');

  const output: InputMediaDocument[] = [];
  const processor = watermarkProcessors[processorKey] ?? defaultWatermarkProcessor;

  const aligns = parseAlignCommands(args);

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