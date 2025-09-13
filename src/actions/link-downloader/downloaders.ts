import { DownloadedMediaItem } from './types';
import { InstagramResponse } from 'instagram-url-direct';
import { savefrom } from '@bochilteam/scraper-savefrom';
import { handleError } from '../../core/handlers/error';

export type DownloadResult =
  | { medias: DownloadedMediaItem[]; description: string }
  | { error: string };

async function twitterDownloader(url: string): Promise<DownloadResult> {
  const { TwitterDL: download } = await import('twitter-downloader');
  const updatedUrl = url.replace('x.com', 'twitter.com').split(' ')[0];

  const data = await download(updatedUrl);
  if (data.status === 'error' || !data.result) {
    await handleError(data);
    return { error: 'Неизвестная ошибка' };
  }

  const media = data.result.media ?? [];
  const medias: DownloadedMediaItem[] = media
    .map((v): DownloadedMediaItem | null => {
      if (v.type === 'photo' && v.image) {
        return { type: 'image', url: v.image };
      }
      if (v.type === 'video' && v.videos?.length) {
        const best = v.videos[0];
        return { type: 'video', url: best.url };
      }
      return null;
    })
    .filter(Boolean) as DownloadedMediaItem[];

  return medias.length
    ? { medias, description: data.result.description }
    : { error: 'Медиа не найдено' };
}

async function instagramDownloader(url: string): Promise<DownloadResult> {
  const { instagramGetUrl: download } = await import('instagram-url-direct');
  const cleanUrl = url.split(' ')[0];

  let data: InstagramResponse;
  try {
    data = (await download(cleanUrl)) as InstagramResponse;
  } catch (_) {
    await handleError(_);
    return { error: 'Неизвестная ошибка' };
  }

  const medias: DownloadedMediaItem[] = data.media_details
    .map((v) => {
      if (v.type === 'image' && v.url) {
        return { type: 'image', url: v.url };
      }
      if (v.type === 'video' && v.url) {
        return { type: 'video', url: v.url, thumbnail: v.thumbnail };
      }
      return null;
    })
    .filter(Boolean) as DownloadedMediaItem[];

  return medias.length
    ? { medias, description: data.post_info.caption }
    : { error: 'Медиа не найдено' };
}

async function youtubeDownloader(url: string): Promise<DownloadResult> {
  try {
    const data = await savefrom(url);
    const description = data[0].meta.title;

    const links: DownloadedMediaItem[] = data[0].url
      .filter(v => v.ext === 'mp4' && v.url.startsWith('https://du.sf-converter.com'))
      .map(v => ({
        type: 'video',
        thumbnail: '',
        url: v.url
      }));

    return {
      medias: links,
      description: description,
    }
  } catch (_) {
    await handleError(_);
    return {
      error: 'Медиа не найдена'
    }
  }
}

export async function downloadFromLink(text: string): Promise<DownloadResult | null> {
  if (
    text.startsWith('https://twitter.com') ||
    text.startsWith('https://x.com')
  ) {
    return twitterDownloader(text);
  }

  if (text.startsWith('https://www.instagram.com')) {
    return instagramDownloader(text);
  }

  if (/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/.test(text)) {
    return youtubeDownloader(text);
  }

  return null;
}