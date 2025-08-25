import { InstagramResponse } from 'instagram-url-direct';

async function getLinksFromUrl(text: string) {
  if (
    text.startsWith('https://twitter.com') ||
    text.startsWith('https://x.com')
  ) {
    const { TwitterDL: download } = await import('twitter-downloader');
    const updatedUrl = text.replace('x.com', 'twitter.com').split(' ')[0];

    const data = await download(updatedUrl);
    if (data.status === 'error' || !data.result) {
      return { error: 'Неизвестная ошибка' };
    }

    const media = data.result.media ?? [];
    const images = media
      .filter((v) => v.type === 'photo' && v.image)
      .map((v) => v.image!);

    return images.length ? images : { error: 'В посте нет фото, только видео' };
  }

  if (text.startsWith('https://www.instagram.com')) {
    const { instagramGetUrl: download } = await import('instagram-url-direct');
    const url = text.split(' ')[0];

    let data: InstagramResponse;
    try {
      data = (await download(url)) as InstagramResponse;
    } catch (e) {
      return { error: 'Неизвестная ошибка' };
    }

    const images = data.media_details
      .filter((v) => v.type === 'image' && v.url)
      .map((v) => v.url!);

    return images.length ? images : { error: 'В посте нет фото, только видео' };
  }

  return { error: 'Неподдерживаемая ссылка' };
}

export { getLinksFromUrl };