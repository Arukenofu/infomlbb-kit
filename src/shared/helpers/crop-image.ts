import { JimpReadType } from '../types/jimp-types';

function cropImage(image: JimpReadType, ratio: `${number}/${number}`) {
  const [wRatio, hRatio] = ratio.split('/').map(Number);
  const { width, height } = image.bitmap;
  const currentRatio = width / height;
  const targetRatio = wRatio / hRatio;

  let cropWidth = width;
  let cropHeight = height;

  if (currentRatio > targetRatio) {
    cropWidth = height * targetRatio;
  } else {
    cropHeight = width / targetRatio;
  }

  const x = (width - cropWidth) / 2;
  const y = (height - cropHeight) / 2;

  return image.crop({x, y, w: cropWidth, h: cropHeight});
}

export {cropImage};