import { translateHero } from '../shared/helpers/translate-hero';
import { Context } from 'telegraf';
import { getWallpaper } from '../shared/helpers/get-wallpaper';

const wallpaperCommand = () => async (
  context: Context
) => {
  if (!('payload' in context)) {
    return;
  }

  const payload = String(context.payload) || '';
  const hero = translateHero(payload, 'en');
  const url = await getWallpaper(hero || '');
  if (!url) {
    await context.sendMessage('Изображения с данным героем не найдено'); return;
  }

  const extension = url.slice(-3);
  const res = await fetch(url, { method: 'GET' });

  if (!res.ok) {
    await context.sendMessage('Изображения с данным героем не найдено'); return;
  }

  await context.sendDocument({
    source: Buffer.from(await res.arrayBuffer()),
    filename: `${payload}.${extension}`
  })
}

export {wallpaperCommand}