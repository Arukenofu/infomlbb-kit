import { Context } from 'telegraf';
import { getLinksFromUrl, getWatermarkImagesFromLinks, parseLinkDownloaderOptions } from '../actions/link-downloader';
import { parseInput } from '../shared/helpers/parse-input';

const onText = () => async (
  context: Context
) => {
  await context.sendMessage('Создание медиа...');

  const links = await getLinksFromUrl(context);
  if (!links) return;

  const {parameters} = parseInput(context.text || '');

  const options = await parseLinkDownloaderOptions(context, parameters);
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