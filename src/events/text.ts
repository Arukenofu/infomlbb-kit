import { parseInput } from '../shared/helpers/parse-input';
import { getLinksFromUrl } from '../actions/link-downloader/get-source-links';
import { has } from '../shared/helpers/object-has';
import { parseLinkDownloaderOptions } from '../actions/link-downloader/get-options';
import { getWatermarkImagesFromLinks } from '../actions/link-downloader/watermark';
import { AIService } from '../services/AI';
import postCreator from '../services/AI/prompts/post-creator';
import { createEventHandler } from '../core/handlers/events.ts';
import { Context, InputFile } from 'grammy';
import { InputMediaDocument } from 'grammy/types';

const handlePost = async (context: Context, description: string) => {
  const ai = new AIService(process.env.AI_SERVICE_KEY, {
    scenario: postCreator,
  });

  const data = await ai.sendText(description);
  const response = ai.readResponse(data);

  await context.reply(response, { parse_mode: 'HTML' });
};

export default createEventHandler('message', async (context) => {
  console.log(context);
  if (!context.message.text || context.message.photo) return;

  const {args, parameters} = parseInput(context.message.text || '');

  const result = await getLinksFromUrl(args[0] || '');

  if (has(result, 'error')) return;

  const {medias, description} = result;

  await context.reply('Создание медиа...');

  const options = await parseLinkDownloaderOptions(args.slice(1), parameters);
  const imageMedias = medias.filter(m => m.type === 'image');
  const videoMedias = medias.filter(m => m.type === 'video');

  if (imageMedias.length > 0) {
    const buffers = await getWatermarkImagesFromLinks(
      imageMedias.map(m => m.url),
      options
    );

    const docs: InputMediaDocument[] = buffers.map((v, i) => ({
      type: 'document',
      media: new InputFile(v.media.source, `image-${i + 1}.png`)
    }))

    await context.replyWithMediaGroup(docs);
  }

  if (videoMedias.length > 0) {
    const videoLinks = videoMedias
      .map((v, i) => `<a href="${v.url}">Ссылка ${i + 1}</a>`)
      .join("\n\n");

    await context.reply(videoLinks, { parse_mode: "HTML" });
  }

  if (description) {
    await handlePost(context, description);
  }
})