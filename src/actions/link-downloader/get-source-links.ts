import {validateURL} from '@distube/ytdl-core';
import {
  DownloadResult,
  instagramDownloader,
  twitterDownloader,
  youtubeDownloader,
} from './downloaders';

async function getLinksFromUrl(text: string): Promise<DownloadResult | {error: string}> {
  if (
    text.startsWith('https://twitter.com') ||
    text.startsWith('https://x.com')
  ) {
    return twitterDownloader(text);
  }

  if (text.startsWith('https://www.instagram.com')) {
    return instagramDownloader(text);
  }

  if (validateURL(text)) {
    return youtubeDownloader(text);
  }

  return { error: 'Неподдерживаемая ссылка' };
}

export { getLinksFromUrl };