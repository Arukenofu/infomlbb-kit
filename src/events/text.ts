import { Context } from 'telegraf';
import { parseInput } from '../shared/helpers/parse-input';
import { getLinksFromUrl } from '../actions/link-downloader/get-source-links';
import { has } from '../shared/helpers/object-has';
import { parseLinkDownloaderOptions } from '../actions/link-downloader/get-options';
import { getWatermarkImagesFromLinks } from '../actions/link-downloader/watermark';

const onText = () => async (
  context: Context
) => {
  const links = await getLinksFromUrl(context.text || '');
  if (!links || has(links, 'error')) return;

  await context.sendMessage('Создание медиа...');

  const {args, parameters} = parseInput(context.text || '');

  const options = await parseLinkDownloaderOptions(args.slice(1, 1), parameters);
  const images = await getWatermarkImagesFromLinks(links, options);

  if (images.length === 1) {
    await context.sendDocument({
      filename: 'photo.png',
      source: images[0].media.source
    })
  } else {
    await context.sendMediaGroup(images);
  }
}

export {onText}