import { getPhotolink } from '../../processes/get-photolink';
import { translateHero } from '../../shared/helpers/translate-hero';
import { Supabase } from '../../services/Supabase';
import { PhotoSize } from 'grammy/types';

async function getAdjustmentParameters(text: string, photo?: PhotoSize[]) {
  if (photo) {
    const imageLink = await getPhotolink(photo);
    const adjustmentCommand = String(
      text.split(' ')[0] || '',
    ).toLowerCase();

    return { imageLink, adjustmentCommand };
  }

  const [adjustmentCommand, hero] = text.split(' ');

  const translatedHero = translateHero(hero || '', 'en');
  const imageLink = await Supabase.getWallpaper(translatedHero);

  return { imageLink, adjustmentCommand };
}
export { getAdjustmentParameters };