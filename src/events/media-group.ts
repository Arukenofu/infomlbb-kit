import { Context } from 'telegraf';
import { InputMediaDocument} from 'telegraf/src/core/types/typegram';
import { PhotoMediaGroupContext } from '@dietime/telegraf-media-group';
import { getMultiplePhotoLinks, } from '../processes/get-photolink';
import { AIService } from '../services/AI';
import { fetchImageAsBase64 } from '../shared/helpers/base64';
import { parseInput } from '../shared/helpers/parse-input';
import { createOverlay } from '../actions/watermark/createOverlay';
import { createWatermark } from '../actions/watermark/createTWatermark';
import patchTranslator from '../services/AI/prompts/patch-translator';
import { IAlignments, parseAlignCommands } from '../actions/watermark/align';
import { has } from '../shared/helpers/object-has';

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

const onMediaGroup = () => async (context: PhotoMediaGroupContext<Context>) => {
  const mediaGroup = context.update.media_group;
  const links = await getMultiplePhotoLinks(mediaGroup, context.telegram);

  const caption = mediaGroup[0].caption || '';

  const { command, args } = parseInput(caption);

  if (command === '/patch') {
    const ai = new AIService(process.env.AI_SERVICE_KEY, {scenario: patchTranslator});
    const base64images = await Promise.all(links.map((v) => fetchImageAsBase64(v, 'image/jpeg')));
    const data = await ai.sendImages(base64images, args.join(' '));
    const response = ai.readResponse(data);

    await context.sendMessage(response);

    return;
  }

  await context.sendMessage('Создание изображении...');

  const output: InputMediaDocument[] = [];
  const processor = processors[command ?? ''] ?? defaultProcessor;

  const aligns = await parseAlignCommands(args);

  if (has(aligns, 'error')) return;

  for (const link of links) {
    const buffer = await processor(link, aligns);

    output.push({
      type: 'document',
      media: { source: buffer, filename: 'photo.png' },
    });
  }

  await context.sendMediaGroup(output);
}

export {onMediaGroup}