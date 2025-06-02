import { Context } from 'telegraf';
import { createOverlay, createWatermark, CreateWatermarkOptions, parseAlignCommands } from './watermark';
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

    const data = await download(url).catch(async (e) => {
      await context.sendMessage(`Неизвестная ошибка`);
      throw new Error(e);
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

interface Images {
  type: 'document';
  media: {
      source: Buffer<ArrayBufferLike>;
      filename: string;
  }
}

interface Options extends CreateWatermarkOptions {
  applyWatermark?: boolean;
}

async function parseLinkDownloaderOptions(
  context: Context
) {
  const applyWatermark = !context.text?.includes('--no');

  let aligns: Options | undefined = {};

  if (applyWatermark) {
    aligns = await parseAlignCommands(context);
  }

  return aligns;
}

async function getWatermarkImagesFromLinks(
  links: string[],
  watermarkOptions: Options = {}
) {
  const output: Images[] = [];

  const processLink = async (link: string) => {
    if (watermarkOptions.applyWatermark) {
      const overlay = await createOverlay(link);
      const image = await createWatermark(overlay, watermarkOptions);
      return await image.getBuffer('image/png');
    } else {
      const response = await fetch(link);
      return Buffer.from(await response.arrayBuffer());
    }
  };

  for (const link of links) {
    const buffer = await processLink(link);

    output.push({
      type: 'document',
      media: { source: buffer, filename: 'photo.png' },
    });
  }

  return output;
}

export { getLinksFromUrl, parseLinkDownloaderOptions, getWatermarkImagesFromLinks };