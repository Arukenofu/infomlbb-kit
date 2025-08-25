import { Images, ParseLinkResult } from './types';
import { createOverlay } from '../watermark/createOverlay';
import { createWatermark } from '../watermark/createTWatermark';

async function getWatermarkImagesFromLinks(
  links: string[],
  watermarkOptions: ParseLinkResult = {},
) {
  const output: Images[] = [];

  const processLink = async (link: string) => {
    if (watermarkOptions.applyWatermark) {
      const overlay = await createOverlay(link);
      const image = await createWatermark(overlay, watermarkOptions);
      return await image.getBuffer('image/png');
    } else {
      const response = await fetch(link);
      return Buffer.from(await response.arrayBuffer());
    }
  };

  for (const link of links) {
    const buffer = await processLink(link);

    output.push({
      type: 'document',
      media: { source: buffer, filename: 'photo.png' },
    });
  }

  return output;
}

export { getWatermarkImagesFromLinks };