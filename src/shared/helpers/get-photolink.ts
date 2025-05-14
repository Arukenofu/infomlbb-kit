import { Context } from 'telegraf';
import { PhotoSize } from 'telegraf/types';

async function getPhotolink(
  photoSizes: PhotoSize[],
  telegram: Context['telegram']
) {
  const photo = photoSizes[photoSizes.length - 1].file_id;

  return (await telegram.getFileLink(photo)).href;
}

export {getPhotolink};