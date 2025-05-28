import { Context } from 'telegraf';
import { getLinksFromUrl, getWatermarkImagesFromLinks } from '../actions/link-downloader';
import { parseAlignCommands } from '../actions/watermark';

const onText = () => async (
  context: Context
) => {
  await context.sendMessage('Создание медиа...');

  const links = await getLinksFromUrl(context);
  if (!links) return;

  const options = await parseAlignCommands(context);

  const images = await getWatermarkImagesFromLinks(links, options ? options : {});
  await context.sendMediaGroup(images);
}

export {onText}