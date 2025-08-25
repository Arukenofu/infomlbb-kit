import { Context } from 'telegraf';
import { PhotoSize } from 'telegraf/types';
import { PhotoMediaGroupContext } from '@dietime/telegraf-media-group';

async function getPhotolink(
  photoSizes: PhotoSize[],
  telegram: Context['telegram']
) {
  const photo = photoSizes[photoSizes.length - 1].file_id;

  return (await telegram.getFileLink(photo)).href;
}

async function getMultiplePhotoLinks(
  mediaGroup: PhotoMediaGroupContext<Context>['update']['media_group'],
  telegram: Context['telegram']
) {
  const output: string[] = [];

  for (let i = 0; i < mediaGroup.length; i++) {
    const media = mediaGroup[i];
    const link = await getPhotolink(media.photo, telegram);

    output.push(link);
  }

  return output;
}

export {getPhotolink, getMultiplePhotoLinks};


