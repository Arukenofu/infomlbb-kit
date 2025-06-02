import { Jimp } from 'jimp';
import { Context } from 'telegraf';
import { Images } from '../shared/enums/images';
import { cropImage } from '../shared/helpers/crop-image';
import { createOverlay, createWatermark } from '../actions/watermark';
import {
  getAdjustmentLinkByPayload,
  getAdjustmentParameters,
  sendFormattedHeroAdjustmentText
} from '../actions/hero-adjustment';

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

  await createOverlay(image, overlay);
  await createWatermark(image, {
    width: image.bitmap.width * .42,
    watermarkInstance: watermark,
    opacity: 1,
    yAlign: .65
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
<code>/adjustment [нерф | бафф] [имя-героя если без изображения]</code>`
}

export { adjustmentCommand }