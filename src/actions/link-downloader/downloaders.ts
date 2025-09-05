import { DownloadedMediaItem } from './types';
import { InstagramResponse } from 'instagram-url-direct';

export type DownloadResult =
  | { medias: DownloadedMediaItem[]; description: string }
  | { error: string };

async function twitterDownloader(url: string): Promise<DownloadResult> {
  const { TwitterDL: download } = await import('twitter-downloader');
  const updatedUrl = url.replace('x.com', 'twitter.com').split(' ')[0];

  const data = await download(updatedUrl);
  if (data.status === 'error' || !data.result) {
    return { error: 'Неизвестная ошибка' };
  }

  const media = data.result.media ?? [];
  const medias: DownloadedMediaItem[] = media
    .map((v) => {
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
  } catch {
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
    const ytdl = await import('@distube/ytdl-core');

    const info = await ytdl.getInfo(url);

    const format = ytdl.chooseFormat(info.formats, {
      quality: 'highestvideo'
    });

    if (!format || !format.url) {
      return { error: 'Не удалось найти подходящий поток видео' };
    }

    const medias: DownloadedMediaItem[] = [
      {
        type: 'video',
        url: format.url,
        thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1]?.url
      }
    ];

    return { medias, description: info.videoDetails.title };
  } catch {
    return { error: 'Неизвестная ошибка' };
  }
}

export {twitterDownloader, instagramDownloader, youtubeDownloader};