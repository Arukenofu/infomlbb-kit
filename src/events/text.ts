import { Context } from 'telegraf';
import { parseInput } from '../shared/helpers/parse-input';
import { getLinksFromUrl } from '../actions/link-downloader/get-source-links';
import { has } from '../shared/helpers/object-has';
import { parseLinkDownloaderOptions } from '../actions/link-downloader/get-options';
import { getWatermarkImagesFromLinks } from '../actions/link-downloader/watermark';
import { AIService } from '../services/AI';
import postCreator from '../services/AI/prompts/post-creator';
import { InputMediaDocument } from 'telegraf/src/core/types/typegram';
import { dedent } from '../shared/helpers/dedent';

export const handlePost = async (context: Context, description: string) => {
  const ai = new AIService(process.env.AI_SERVICE_KEY, {
    scenario: postCreator,
  });

  const data = await ai.sendText(description);
  const response = ai.readResponse(data);

  await context.sendMessage(response, { parse_mode: 'HTML' });
};

const onText = () => async (
  context: Context
) => {
  const {args, parameters} = parseInput(context.text || '');

  const result = await getLinksFromUrl(args[0] || '');

  if (has(result, 'error')) return;

  const {medias, description} = result;

  await context.sendMessage('Создание медиа...');

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
      media: {
        filename: `image-${i+1}.png`,
        source: v.media.source
      }
    }))

    await context.sendMediaGroup(docs);
  }

  const videoLinks = `
  ${videoMedias.map((v, i) => dedent(`
    <a href="${v.url}">Ссылка ${i + 1}</a>
  `)).join('\n\n')}
  `.trim();

  videoLinks && await context.sendMessage(videoLinks, { parse_mode: 'HTML' });

  if (description) {
    await handlePost(context, description);
  }
}

export {onText}