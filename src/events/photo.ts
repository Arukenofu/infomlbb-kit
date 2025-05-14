import { Context } from 'telegraf';
import {
  overlayCommand,
  watermarkCommand,
  twatermarkCommand,
  adjustmentCommand,
} from '../commands';

const onPhoto = () => async (
  context: Context
) => {
  if (!('photo' in context.message!)) {
    return;
  }

  const caption = context.message.caption || ''

  if (caption.startsWith('/overlay')) {
    await overlayCommand()(context);
  } else if (caption.startsWith('/watermark')) {
    await watermarkCommand()(context);
  } else if (caption.startsWith('/twatermark') || caption === '') {
    await twatermarkCommand()(context);
  } else if (caption.startsWith('/adjustment')) {
    await adjustmentCommand()(context);
  }
}

export {onPhoto}