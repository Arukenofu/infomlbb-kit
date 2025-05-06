import { BlendMode, Jimp } from 'jimp';

type JimpReadType = Awaited<ReturnType<typeof Jimp.read>>;

async function createOverlay(photoLink: string | JimpReadType) {
  const [image, overlay] = await Promise.all([
    typeof photoLink === "string" ? Jimp.read(photoLink) : photoLink,
    Jimp.read('https://hdknnncxvrdqnyijnprx.supabase.co/storage/v1/object/public/watermarks//overlay.png')
  ]);

  overlay.opacity(.09);
  overlay.resize({
    w: 1250
  });

  image.composite(overlay, 0, 0, {
    opacityDest: 1,
    opacitySource: 1
  });

  return image;
}

async function createWatermark(photoLink: string | JimpReadType) {
  const [image, watermark] = await Promise.all([
    typeof photoLink === "string" ? Jimp.read(photoLink) : photoLink,
    Jimp.read('https://hdknnncxvrdqnyijnprx.supabase.co/storage/v1/object/public/watermarks//watermark.png')
  ]);

  watermark.resize({
    w: image.bitmap.width * 0.8
  });
  watermark.opacity(.35);

  const x = (image.bitmap.width - watermark.bitmap.width) / 2;
  const y = image.bitmap.height * 0.75 - watermark.bitmap.height / 2;

  image.composite(watermark, x, y, {
    mode: BlendMode.OVERLAY,
    opacityDest: 1,
    opacitySource: 1
  });

  return image;
}

export {createOverlay, createWatermark}