import { Telegram } from 'telegraf';
import { getPhotolink } from '../../processes/get-photolink';
import { translateHero } from '../../shared/helpers/translate-hero';
import { getWallpaper } from '../../shared/helpers/supabase-storage';
import { PhotoSize } from 'telegraf/types';

interface AdjustmentParamsInput {
  photo?: PhotoSize[];
  telegram?: Telegram
}

async function getAdjustmentParameters(text: string, input: AdjustmentParamsInput) {
  if (input.photo && input.telegram) {
    const imageLink = await getPhotolink(input.photo, input.telegram);
    const adjustmentCommand = String(
      text.split(' ')[1] || '',
    ).toLowerCase();

    return { imageLink, adjustmentCommand };
  }

  const [adjustmentCommand, hero] = text.split(' ');

  const translatedHero = translateHero(hero || '', 'en');
  const imageLink = await getWallpaper(translatedHero);

  return { imageLink, adjustmentCommand };
}
export { getAdjustmentParameters };