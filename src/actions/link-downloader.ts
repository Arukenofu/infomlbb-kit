import { Context } from 'telegraf';
import { InputMediaDocument } from 'telegraf/src/core/types/typegram';
import { createOverlay, createWatermark, CreateWatermarkOptions } from './watermark';
import { InstagramResponse } from 'instagram-url-direct';

async function getLinksFromUrl(context: Context) {
  const text = context.text! || '';

  if (
    text.startsWith('https://twitter.com') ||
    text.startsWith('https://x.com')
  ) {
    const { TwitterDL: download } = await import('twitter-downloader');
    const updatedUrl = text.replace('x.com', 'twitter.com').split(' ')[0];

    const data = await download(updatedUrl);

    if (data.status === 'error' || !data.result) {
      await context.sendMessage(`Неизвестная ошибка`);
      return null;
    }

    const media = data.result.media;

    if (!media?.length) {
      await context.sendMessage(`В посте нет медиа`); return;
    }

    const images = media
      .filter((value) => value.type === 'photo' && value.image)
      .map((value) => value.image!);

    if (images.length === 0) {
      await context.sendMessage(`В посте нет фото, только видео`); return;
    }

    return images;
  }

  if (text.startsWith('https://www.instagram.com')) {
    const {instagramGetUrl: download} = await import('instagram-url-direct');
    const url = text.split(' ')[0];

    const data = await download(url).catch(async () => {
      await context.sendMessage(`Неизвестная ошибка`);
      throw new Error();
    }) as InstagramResponse;

    if (data.url_list.length === 0) {
      await context.sendMessage(`В посте нет медиа`); return;
    }

    const images = data.media_details
      .filter((value) => value.type === 'image' && value.url)
      .map((value) => value.url!);

    if (images.length === 0) {
      await context.sendMessage(`В посте нет фото, только видео`); return;
    }

    return images;
  }
}

async function getWatermarkImagesFromLinks(
  links: string[],
  watermarkOptions: CreateWatermarkOptions = {}
) {
  const output: InputMediaDocument[] = [];

  for (const item of links) {
    const image = await createWatermark(await createOverlay(item), watermarkOptions);
    const buffer = await image.getBuffer('image/png');

    output.push({
      type: 'document',
      media: { source: buffer, filename: 'photo.png' },
    });
  }

  return output;
}

export { getLinksFromUrl, getWatermarkImagesFromLinks };