import { Context } from 'telegraf';
import { parseInput } from '../shared/helpers/parse-input';
import { getLinksFromUrl } from '../actions/link-downloader/get-source-links';
import { has } from '../shared/helpers/object-has';
import { parseLinkDownloaderOptions } from '../actions/link-downloader/get-options';
import { getWatermarkImagesFromLinks } from '../actions/link-downloader/watermark';
import { AIService } from '../services/AI';
import postCreator from '../services/AI/prompts/post-creator';

const onText = () => async (
  context: Context
) => {
  const {args, parameters} = parseInput(context.text || '');

  const { images, description } = await getLinksFromUrl(args[0]);
  if (!images || has(images, 'error')) return;

  await context.sendMessage('Создание медиа...');

  if (description) {
    const ai = new AIService(process.env.AI_SERVICE_KEY, {
      scenario: postCreator
    });

    ai.sendText(description || 'Нет контента, а значит можешь написать <b>[ПУСТО]</b>').then((v) => {
      context && context.sendMessage(ai.readResponse(v), {parse_mode: 'HTML'});
    })
  }

  const options = await parseLinkDownloaderOptions(args.slice(1), parameters);
  const medias = await getWatermarkImagesFromLinks(images, options);

  if (medias.length === 1) {
    await context.sendDocument({
      filename: 'photo.png',
      source: medias[0].media.source
    })
  } else {
    await context.sendMediaGroup(medias);
  }
}

export {onText}