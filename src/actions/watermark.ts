import { BlendMode, Jimp } from 'jimp';
import { Images } from '../shared/enums/images';
import { JimpReadType } from '../shared/types/jimp-types';
import { XAlignments, YAlignments } from '../shared/enums/Alignments';
import { calculateElementsPosition } from '../shared/helpers/calculateElementsPosition';
import { Context } from 'telegraf';

async function createOverlay(
  photoLink: string | JimpReadType,
  overlayInstance?: JimpReadType,
) {
  const [image, overlay] = await Promise.all([
    typeof photoLink === 'string' ? Jimp.read(photoLink) : photoLink,
    overlayInstance || Jimp.read(Images.Overlay),
  ]);

  overlay.opacity(0.09);
  overlay.resize({
    w: Math.max(image.bitmap.width, 1250),
  });

  image.composite(overlay, 0, 0, {
    opacityDest: 1,
    opacitySource: 1,
  });

  return image;
}

interface CreateWatermarkOptions {
  watermarkInstance?: JimpReadType;

  width?: number;
  opacity?: number;
  blendMode?: BlendMode;

  xAlign?: XAlignments | number;
  yAlign?: YAlignments | number;
}

async function createWatermark(
  photoLink: string | JimpReadType,
  options: CreateWatermarkOptions = {},
) {
  const [image, watermark] = await Promise.all([
    typeof photoLink === 'string' ? Jimp.read(photoLink) : photoLink,
    options.watermarkInstance || Jimp.read(Images.Watermark),
  ]);

  const {
    width = image.bitmap.width * 0.8,
    opacity = 0.35,
    xAlign = XAlignments.Center,
    yAlign = 0.75,
    blendMode,
  } = options;

  watermark.resize({
    w: width,
  });
  watermark.opacity(opacity);

  const { x, y } = calculateElementsPosition(
    image,
    watermark,
    xAlign,
    yAlign,
  );

  image.composite(watermark, x, y, {
    mode: blendMode,
    opacityDest: 1,
    opacitySource: 1,
  });

  return image;
}

async function parseAlignCommands(
  context: Context
) {
  const commands = context.text?.split(' ').slice(1) || [];

  const aligns: { xAlign?: XAlignments | number, yAlign?: YAlignments | number } = {};

  const isXAlignment = (val: string): val is XAlignments =>
    Object.values(XAlignments).includes(val as XAlignments);

  const isYAlignment = (val: string): val is YAlignments =>
    Object.values(YAlignments).includes(val as YAlignments);

  const isNumeric = (val: string): boolean =>
    !isNaN(Number(val));

  const toNumber = (val: string): number =>
    Number(val) / 100;

  if (!commands.length) {
    return aligns;
  }

  if (commands.length === 1) {
    const value = commands[0];

    if (isNumeric(value) && Number(value) > 100 && 0 > Number(value)) {
      await context.sendMessage('Задан неправильный числовой параметр, выберите от 0 до 100'); return null;
    }

    if (isXAlignment(value)) {
      aligns.xAlign = value;
    } else if (isYAlignment(value)) {
    aligns.yAlign = value;
    } else if (isNumeric(value)) {
      aligns.xAlign = toNumber(value) ;
    } else {
      await context.sendMessage('Задан неправильный параметр'); return null;
    }
  }

  if (commands.length === 2) {
    const [xVal, yVal] = commands;

    if (isXAlignment(xVal)) {
      aligns.xAlign = xVal;
    } else if (isNumeric(xVal)) {
      aligns.xAlign = toNumber(xVal);
    } else {
      await context.sendMessage('Неверный параметр для X-выравнивания'); return null;
    }

    if (isYAlignment(yVal)) {
      aligns.yAlign = yVal;
    } else if (isNumeric(yVal)) {
      aligns.yAlign = toNumber(yVal);
    } else {
      await context.sendMessage('Неверный параметр для Y-выравнивания'); return null;
    }
  }

  return aligns;
}

export { createOverlay, createWatermark, parseAlignCommands, CreateWatermarkOptions };