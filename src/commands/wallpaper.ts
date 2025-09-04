import { Context } from 'telegraf';
import { translateHero } from '../shared/helpers/translate-hero';
import { Supabase } from '../services/Supabase';

const wallpaperCommand = () => async (
  context: Context
) => {
  if (!('payload' in context)) {
    return;
  }

  const payload = String(context.payload) || '';
  if (!payload) {
   await context.sendMessage(ErrorMessages.NO_PAYLOAD); return;
  }

  const hero = translateHero(payload, 'en');
  if (!hero) {
    await context.sendMessage(ErrorMessages.HERO_NOT_FOUND); return;
  }

  await context.sendMessage('Поиск изображения...');

  const url = await Supabase.getWallpaper(hero || '');
  if (!url) {
    await context.sendMessage(ErrorMessages.IMAGE_NOT_FOUND); return;
  }

  const extension = url.slice(-3);
  const res = await fetch(url, { method: 'GET' });

  if (!res.ok) {
    await context.sendMessage(ErrorMessages.IMAGE_NOT_FOUND); return;
  }

  await context.sendDocument({
    source: Buffer.from(await res.arrayBuffer()),
    filename: `${payload}.${extension}`
  });
}

enum ErrorMessages {
  NO_PAYLOAD = 'Укажите имя героя. Нужно указать имя героя на кириллице/латинице, используя "-" как пробел.',
  HERO_NOT_FOUND = 'Имя героя не корректно.',
  IMAGE_NOT_FOUND = 'Изображения с данным героем не найдено.'
}

export {wallpaperCommand}