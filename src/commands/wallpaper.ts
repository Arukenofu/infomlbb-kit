import { translateHero } from '../shared/helpers/translate-hero';
import { Supabase } from '../services/Supabase';
import { createCommandHandler } from '../core/handlers/command';
import { getPayload } from '../shared/helpers/getPayload';
import { InputFile } from 'grammy';

export default createCommandHandler('wallpaper', async (context) => {
  const payload = getPayload(context.message?.text || '');

  if (!payload) {
    return context.reply(ErrorMessages.NO_PAYLOAD);
  }

  const hero = translateHero(payload, 'en');
  if (!hero) {
    return context.reply(ErrorMessages.HERO_NOT_FOUND);
  }

  await context.reply('Поиск изображения...');

  const url = await Supabase.getWallpaper(hero || '');
  if (!url) {
    return context.reply(ErrorMessages.IMAGE_NOT_FOUND);
  }

  const extension = url.slice(-3);
  const res = await fetch(url, { method: 'GET' });

  if (!res.ok) {
    return context.reply(ErrorMessages.IMAGE_NOT_FOUND);
  }

  await context.replyWithPhoto(
    new InputFile(Buffer.from(await res.arrayBuffer()), `${payload}.${extension}`)
  );
})

enum ErrorMessages {
  NO_PAYLOAD = 'Укажите имя героя. Нужно указать имя героя на кириллице/латинице, используя "-" как пробел.',
  HERO_NOT_FOUND = 'Имя героя не корректно.',
  IMAGE_NOT_FOUND = 'Изображения с данным героем не найдено.'
}