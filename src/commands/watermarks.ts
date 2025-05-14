import { Context } from 'telegraf';
import { getPhotolink } from '../shared/helpers/get-photolink';
import { createOverlay, createWatermark } from '../actions/watermark';

const watermarkCommand = () => async (
  context: Context
) => {
  if (!('photo' in context.message!)) {
    await context.sendMessage('Прикрепите фотографию.');

    return;
  }

  const photoLink = await getPhotolink(context.message.photo, context.telegram);
  const image = await createWatermark(photoLink!);

  const output = await image.getBuffer('image/png');

  await context.sendDocument({source: output, filename: 'image.png'});
}

const twatermarkCommand = () => async (
  context: Context
) => {
  if (!('photo' in context.message!)) {
    await context.sendMessage('Прикрепите фотографию.');

    return;
  }

  const photoLink = await getPhotolink(context.message.photo, context.telegram);
  const image = await createOverlay(photoLink!).then((value) => {
    return createWatermark(value);
  });
  const output = await image.getBuffer('image/png');

  await context.sendDocument({source: output, filename: 'image.png'});
}

const overlayCommand = () => async (
  context: Context
) => {
  if (!('photo' in context.message!)) {
    await context.sendMessage('Прикрепите фотографию.');

    return;
  }

  const photoLink = await getPhotolink(context.message.photo, context.telegram);
  const image = await createOverlay(photoLink!);
  const output = await image.getBuffer('image/png');

  await context.sendDocument({source: output, filename: 'image.png'});
}

export {watermarkCommand, overlayCommand, twatermarkCommand};