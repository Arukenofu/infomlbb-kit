import { JimpReadType } from '../../shared/types/jimp-types';
import { Jimp } from 'jimp';
import { Images } from '../../shared/enums/images';

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

export { createOverlay };
