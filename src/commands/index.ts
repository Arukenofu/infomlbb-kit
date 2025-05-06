import { startCommand } from './start';
import { helpCommand } from './help';
import { Telegraf } from 'telegraf';
import { overlayCommand, twatermarkCommand, watermarkCommand } from './watermark';
import { formatCommand } from './format';

const commands = {
  'start': startCommand,
  'help': helpCommand,
  'overlay': overlayCommand,
  'watermark': watermarkCommand,
  'twatermark': twatermarkCommand,
  'format': formatCommand
}

export function injectCommands(bot: Telegraf) {
  for (const [name, handlerFactory] of Object.entries(commands)) {
    bot.command(name, handlerFactory());
  }
}

export * from './help';
export * from './start';
export * from './watermark';
export * from './format';