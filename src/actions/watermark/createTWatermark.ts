import {JimpReadType} from "../../shared/types/jimp-types";
import {BlendMode, Jimp} from "jimp";
import { Images } from '../../shared/enums/images';
import { XAlignments, YAlignments } from '../../shared/enums/Alignments';
import {calculateElementsPosition} from "../../shared/helpers/calculateElementsPosition";

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

  const { x, y } = calculateElementsPosition(image, watermark, xAlign, yAlign);

  image.composite(watermark, x, y, {
    mode: blendMode,
    opacityDest: 1,
    opacitySource: 1,
  });

  return image;
}

export {createWatermark};
export {CreateWatermarkOptions};