import { BlendMode, Jimp } from 'jimp';
import { Images } from '../shared/enums/images';
import { JimpReadType } from '../shared/types/jimp-types';
import { Alignments } from '../shared/enums/Alignments';
import { calculateElementsPosition } from '../shared/helpers/calculateElementsPosition';

async function createOverlay(
  photoLink: string | JimpReadType,
  overlayInstance?: JimpReadType
) {
  const [image, overlay] = await Promise.all([
    typeof photoLink === "string" ? Jimp.read(photoLink) : photoLink,
    overlayInstance || Jimp.read(Images.Overlay)
  ]);

  overlay.opacity(.09);
  overlay.resize({
    w: Math.max(image.bitmap.width, 1250)
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

  xAlign?: Alignments | number;
  yAlign?: Alignments | number;
}

async function createWatermark(
  photoLink: string | JimpReadType,
  options: CreateWatermarkOptions = {}
) {
  const [image, watermark] = await Promise.all([
    typeof photoLink === "string" ? Jimp.read(photoLink) : photoLink,
    options.watermarkInstance || Jimp.read(Images.Watermark)
  ]);

  const {
    width = image.bitmap.width * 0.8,
    opacity = .35,
    xAlign = Alignments.Center,
    yAlign = .75,
    blendMode
  } = options;

  watermark.resize({
    w: width
  });
  watermark.opacity(opacity);

  const {x, y} = calculateElementsPosition(image, watermark, xAlign, yAlign);

  image.composite(watermark, x, y, {
    mode: blendMode,
    opacityDest: 1,
    opacitySource: 1
  });

  return image;
}

export {createOverlay, createWatermark, CreateWatermarkOptions};