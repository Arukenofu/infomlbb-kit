import { Context } from 'telegraf';
import { getPhotolink } from '../shared/helpers/get-photolink';
import { createOverlay, createWatermark } from '../actions/watermark';
import { JimpReadType } from '../shared/types/jimp-types';
import { BlendMode } from 'jimp';

const processImage = async (
  context: Context,
  processor: (photoLink: string) => Promise<JimpReadType>,
) => {
  if (!('photo' in context.message!)) {
    await context.sendMessage('Прикрепите фотографию.');
    return;
  }

  await context.sendMessage('Создание изображения...');

  const photoLink = await getPhotolink(context.message.photo, context.telegram);
  const image = await processor(photoLink!);

  const output = await image.getBuffer('image/png');

  await context.sendDocument({ source: output, filename: 'image.png' });
};

const watermarkCommand = () => async (context: Context) => {
  await processImage(context, (photoLink) =>
    createWatermark(photoLink),
  );
};

const overlayCommand = () => async (context: Context) => {
  await processImage(context, (photoLink) =>
    createOverlay(photoLink),
  );
};

const twatermarkCommand = () => async (context: Context) => {
  await processImage(context, async (photoLink) => createWatermark(await createOverlay(photoLink), {
    blendMode: BlendMode.OVERLAY
  }));
};

export { watermarkCommand, overlayCommand, twatermarkCommand };