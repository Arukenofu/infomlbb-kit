import { PhotoSize } from 'grammy/types'

import { telegram } from '../core';

async function getPhotolink(photoSizes: PhotoSize[]) {
  const photoId = photoSizes[photoSizes.length - 1].file_id;
  const file = await telegram.getFile(photoId);
  return `https://api.telegram.org/file/bot${telegram.token}/${file.file_path}`;
}

async function getMultiplePhotoLinks(
  mediaGroup: PhotoSize[][]
) {
  const output: string[] = [];

  for (const media of mediaGroup) {
    const link = await getPhotolink(media);
    output.push(link);
  }

  return output;
}

export {getPhotolink, getMultiplePhotoLinks};


