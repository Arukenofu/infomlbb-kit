import { Context } from 'telegraf';
import {
  overlayCommand,
  watermarkCommand,
  twatermarkCommand,
  adjustmentCommand,
  translateCommand,
  aiCommand,
} from '../commands';
import { parseInput } from '../shared/helpers/parse-input';

type CommandHandler = (ctx: any) => Promise<void>;

const commands: Record<string, CommandHandler> = {
  '/overlay': overlayCommand(),
  '/watermark': watermarkCommand(),
  '/twatermark': twatermarkCommand(),
  '/adjustment': adjustmentCommand(),
  '/patch': translateCommand(),
  '/ai': aiCommand()
};

const onPhoto = () => async (
  context: Context
) => {
  if (!('photo' in context.message!)) return;

  const caption = context.message.caption || '';
  const {command} = parseInput(caption);

  if (command && commands[command]) {
    await commands[command](context);
  } else {
    await twatermarkCommand()(context);
  }
}

export {onPhoto}