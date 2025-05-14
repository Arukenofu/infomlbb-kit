import { Context } from 'telegraf';
import { InputMediaDocument} from 'telegraf/src/core/types/typegram';
import { PhotoMediaGroupContext } from '@dietime/telegraf-media-group';

import { getPhotolink } from '../shared/helpers/get-photolink';
import { createOverlay, createWatermark } from '../actions/watermark';

const onMediaGroup = () => async (context: PhotoMediaGroupContext<Context>) => {
  const mediaGroup = context.update.media_group;
  const caption = mediaGroup[0].caption || '';

  const output: InputMediaDocument[] = [];

  async function processImage(link: string) {
    if (caption.startsWith('/overlay')) {
      return createOverlay(link).then(img => img.getBuffer('image/png'));
    }

    if (caption.startsWith('/watermark')) {
      return createWatermark(link).then(img => img.getBuffer('image/png'));
    }

    const overlayed = await createOverlay(link);
    const watermarked = await createWatermark(overlayed);
    return watermarked.getBuffer('image/png');
  }

  for (const item of mediaGroup) {
    const link = await getPhotolink(item.photo, context.telegram);
    const buffer = await processImage(link);

    output.push({
      type: 'document',
      media: {source: buffer, filename: 'photo.png'},
    });
  }

  await context.sendMediaGroup(output);
}

export {onMediaGroup}