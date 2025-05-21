import { Context } from 'telegraf';
import { Jimp } from 'jimp';
import {
  getAdjustmentLinkByPayload,
  getAdjustmentParameters,
  sendFormattedHeroAdjustmentText
} from '../actions/hero-adjustment';
import { Images } from '../shared/enums/images';
import { cropImage } from '../shared/helpers/crop-image';

const adjustmentCommand = () => async (
  context: Context,
) => {
  const {imageLink, adjustmentCommand} = await getAdjustmentParameters(context);

  if (!adjustmentCommand) {
    await context.sendMessage(ErrorMessages.NO_ADJUSTMENT, {parse_mode: "HTML"}); return;
  }

  if (!imageLink) {
    await context.sendMessage(ErrorMessages.NO_IMAGE, {parse_mode: 'HTML'}); return;
  }

  const adjustmentImageUrl = getAdjustmentLinkByPayload(adjustmentCommand);

  if (adjustmentImageUrl === null) {
    await context.sendMessage(ErrorMessages.NO_ADJUSTMENT, {parse_mode: "HTML"}); return;
  }

  await context.sendMessage('Создание изображения...');

  await sendFormattedHeroAdjustmentText(context, adjustmentCommand);

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

enum ErrorMessages {
  NO_ADJUSTMENT = `Неправильно был задан параметр изменения героя, выберите из текущего списка:
Бафф: бафф, усиление, +
Нерф: нерф, ослабление, -
Изменение: изменение, =

<code>/adjustment [нерф | бафф | изменение]</code>`,


  NO_IMAGE = `Прикрепите изображение к команде или укажите третьим параметром правильное имя героя:
<code>/adjustment [нерф | бафф] [имя_героя если без изображения]</code>`
}

export { adjustmentCommand }