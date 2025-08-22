import { Context } from 'telegraf';
import {
  overlayCommand,
  watermarkCommand,
  twatermarkCommand,
  adjustmentCommand,
  translateCommand,
} from '../commands';

type CommandHandler = (ctx: any) => Promise<void>;

const commands: Record<string, CommandHandler> = {
  '/overlay': overlayCommand(),
  '/watermark': watermarkCommand(),
  '/twatermark': twatermarkCommand(),
  '/adjustment': adjustmentCommand(),
  '/patch': translateCommand(),
};

const onPhoto = () => async (
  context: Context
) => {
  if (!('photo' in context.message!)) {
    return;
  }

  const caption = context.message.caption || ''

  const matched = Object.entries(commands).find(([key]) =>
    caption.startsWith(key)
  );

  if (matched) {
    const [, handler] = matched;
    await handler(context);
  } else if (caption === '') {
    await twatermarkCommand()(context);
  }
}

export {onPhoto}