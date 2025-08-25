import { Context } from 'telegraf';
import { getPhotolink } from '../processes/get-photolink';
import { parseAlignCommands } from '../actions/watermark/align';
import { JimpReadType } from '../shared/types/jimp-types';
import { BlendMode } from 'jimp';
import {createOverlay} from "../actions/watermark/createOverlay";
import { createWatermark } from '../actions/watermark/createTWatermark';
import { parseInput } from '../shared/helpers/parse-input';
import { has } from '../shared/helpers/object-has';

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
  const {args} = parseInput(context.text || '');

  const aligns = await parseAlignCommands(args);

  if (has(aligns, 'error')) {
    return;
  }

  await processImage(context, (photoLink) =>
    createWatermark(photoLink, {
      ...aligns
    }),
  );
};

const overlayCommand = () => async (context: Context) => {
  await processImage(context, (photoLink) =>
    createOverlay(photoLink),
  );
};

const twatermarkCommand = () => async (context: Context) => {
  const {args} = parseInput(context.text || '');

  const aligns = await parseAlignCommands(args);

  if (!aligns) {
    return;
  }

  await processImage(context, async (photoLink) => createWatermark(await createOverlay(photoLink), {
    blendMode: BlendMode.OVERLAY,
    ...aligns
  }));
};

export { watermarkCommand, overlayCommand, twatermarkCommand };