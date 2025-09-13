import { createWatermark } from './createTWatermark';
import { IAlignments } from './align';
import { createOverlay } from './createOverlay';

export type WatermarkProcessor = (link: string, aligns?: IAlignments) => Promise<Buffer>;

export const defaultWatermarkProcessor: WatermarkProcessor = async (link, aligns) => {
  const image = await createWatermark(await createOverlay(link), {
    ...aligns
  });
  return image.getBuffer('image/png');
};

export const watermarkProcessors: Record<string, WatermarkProcessor> = {
  'overlay': async (link) =>
    createOverlay(link).then(img => img.getBuffer('image/png')),

  'watermark': async (link, aligns) =>
    createWatermark(link, aligns).then(img => img.getBuffer('image/png')),

  'twatermark': defaultWatermarkProcessor
};