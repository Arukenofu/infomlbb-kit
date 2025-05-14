import { Context } from 'telegraf';
import {getAdjustmentLinkByPayload} from "../actions/hero-adjustment";
import {getPhotolink} from "../shared/helpers/get-photolink";
import { Images } from '../shared/enums/images';
import { Jimp } from 'jimp';
import { cropImage } from '../shared/helpers/crop-image';

const adjustmentCommand = () => async (
  context: Context,
) => {
  if (!('photo' in context.message!)) {
    await context.sendMessage('Прикрепите фотографию.');

    return;
  }

  const payload = String(context.message.caption?.split(' ')[1] || '').toLowerCase();
  const adjustmentImageUrl = getAdjustmentLinkByPayload(payload);

  if (adjustmentImageUrl === null) {
      await context.sendMessage(
`Неправильно был задан параметр, выберите из текущего списка:
Бафф: бафф, усиление, +
Нерф: нерф, ослабление, -
Изменение: изменение, =`); return;
  }
  const imageLink = await getPhotolink(context.message.photo, context.telegram);

  const [
    image,
    overlay,
    watermark,
    adjustment
  ] = await Promise.all([
    Jimp.read(imageLink),
    Jimp.read(Images.Overlay),
    Jimp.read(Images.Watermark),
    Jimp.read(adjustmentImageUrl),
  ]);

  cropImage(image, '3/2')

  adjustment.resize({
    w: image.bitmap.width * 0.70
  });

  const adjustmentX = (image.bitmap.width - adjustment.bitmap.width) / 2;
  const adjustmentY = image.bitmap.height * 0.78 - adjustment.bitmap.height / 2;

  image.composite(adjustment, adjustmentX, adjustmentY);

  overlay.opacity(.09);
  overlay.resize({
    w: 1250
  });

  image.composite(overlay, 0, 0, {
    opacityDest: 1,
    opacitySource: 1
  });

  watermark.resize({
    w: image.bitmap.width * 0.42
  });

  const watermarkX = (image.bitmap.width - watermark.bitmap.width) / 2;
  const watermarkY = image.bitmap.height * 0.65 - watermark.bitmap.height / 2;

  image.composite(watermark, watermarkX, watermarkY, {
    opacityDest: 1,
    opacitySource: 1
  });

  const output = await image.getBuffer('image/png');

  await context.sendDocument({source: output, filename: 'image.png'});
}

export { adjustmentCommand }