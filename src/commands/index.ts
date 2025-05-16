import { startCommand } from './start';
import { helpCommand } from './help';
import { Telegraf } from 'telegraf';
import { overlayCommand, twatermarkCommand, watermarkCommand } from './watermarks';
import { formatCommand } from './format';
import { adjustmentCommand } from './adjustment';
import { patchImage } from '@/commands/patch-image';

const commands = {
  'start': startCommand,
  'help': helpCommand,
  'overlay': overlayCommand,
  'watermark': watermarkCommand,
  'twatermark': twatermarkCommand,
  'format': formatCommand,
  'adjustment': adjustmentCommand,
  'patchimage': patchImage
}

export function injectCommands(bot: Telegraf) {
  for (const [name, handlerFactory] of Object.entries(commands)) {
    bot.command(name, handlerFactory());
  }
}

export * from './help';
export * from './start';
export * from './watermarks';
export * from './format';
export * from './adjustment';