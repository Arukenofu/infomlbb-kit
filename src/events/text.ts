import { Context } from 'telegraf';
import { getLinksFromUrl, getWatermarkImagesFromLinks } from '../actions/link-downloader';
import { parseAlignCommands } from '../actions/watermark';
import { InputFile } from 'telegraf/types';

const onText = () => async (
  context: Context
) => {
  await context.sendMessage('Создание медиа...');

  const links = await getLinksFromUrl(context);
  if (!links) return;

  const options = await parseAlignCommands(context);

  const images = await getWatermarkImagesFromLinks(links, options ? options : {});

  if (images.length === 1) {
    await context.sendDocument({
      filename: 'photo.png',
      source: ((images[0].media as {source: Buffer<ArrayBufferLike>}).source)
    })
  } else {
    await context.sendMediaGroup(images);
  }
}

export {onText}