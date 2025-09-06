import { Jimp } from 'jimp';
import { Images } from '../shared/enums/images';
import { cropImage } from '../shared/helpers/crop-image';
import {
  getAdjustmentLinkByPayload,
  getFormattedHeroAdjustmentText
} from '../actions/hero-adjustment';
import { createOverlay } from '../actions/watermark/createOverlay';
import { createWatermark } from '../actions/watermark/createTWatermark';
import { getAdjustmentParameters } from '../actions/hero-adjustment/parameters';
import { createCommandHandler } from '../core/handlers/command';
import { InputFile } from 'grammy';
import { getText } from '../processes/get-text';
import { getPayload } from '../shared/helpers/getPayload';

export default createCommandHandler("adjustment", async (context) => {
  const payload = getPayload(getText(context));

  const { imageLink, adjustmentCommand } = await getAdjustmentParameters(
    payload, context.message?.photo
  );

  const hero = payload.split(' ')?.[1] || "";

  if (!adjustmentCommand) {
    return context.reply(ErrorMessages.NO_ADJUSTMENT, {
      parse_mode: "HTML",
    });
  }

  if (!imageLink) {
    return context.reply(ErrorMessages.NO_IMAGE, {
      parse_mode: "HTML",
    });
  }

  const adjustmentImageUrl = getAdjustmentLinkByPayload(adjustmentCommand);

  if (adjustmentImageUrl === null) {
    return context.reply(ErrorMessages.NO_ADJUSTMENT, {
      parse_mode: "HTML",
    });
  }

  await context.reply("Создание изображения...");

  const adjustmentText = await getFormattedHeroAdjustmentText(
    hero,
    adjustmentCommand
  );
  await context.reply(adjustmentText, { parse_mode: "HTML" });

  const [image, overlay, watermark, adjustment] = await Promise.all([
    Jimp.read(imageLink),
    Jimp.read(Images.Overlay),
    Jimp.read(Images.Watermark),
    Jimp.read(adjustmentImageUrl),
  ]);

  cropImage(image, "3/2");

  adjustment.resize({
    w: image.bitmap.width * 0.7,
  });

  const adjustmentX = (image.bitmap.width - adjustment.bitmap.width) / 2;
  const adjustmentY = image.bitmap.height * 0.78 - adjustment.bitmap.height / 2;

  image.composite(adjustment, adjustmentX, adjustmentY);

  await createOverlay(image, overlay);
  await createWatermark(image, {
    width: image.bitmap.width * 0.42,
    watermarkInstance: watermark,
    opacity: 1,
    yAlign: 0.65,
  });

  const output = await image.getBuffer('image/png');

  await context.replyWithDocument(new InputFile(output, "image.png"));
});

enum ErrorMessages {
  NO_ADJUSTMENT = `Неправильно был задан параметр изменения героя, выберите из текущего списка:
Бафф: бафф, усиление, +
Нерф: нерф, ослабление, -
Изменение: изменение, =

<code>/adjustment [нерф | бафф | изменение]</code>`,


  NO_IMAGE = `Прикрепите изображение к команде или укажите третьим параметром правильное имя героя:
<code>/adjustment [нерф | бафф] [имя-героя если без изображения]</code>`
}