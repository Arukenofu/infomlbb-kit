import { Context } from 'telegraf';
import { getLinksFromUrl, getWatermarkImagesFromLinks, parseLinkDownloaderOptions } from '../actions/link-downloader';

const onText = () => async (
  context: Context
) => {
  await context.sendMessage('Создание медиа...');

  const links = await getLinksFromUrl(context);
  if (!links) return;

  const options = await parseLinkDownloaderOptions(context);
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