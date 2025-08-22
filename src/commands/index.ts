import { Telegraf } from 'telegraf';
import { startCommand } from './start';
import { helpCommand } from './help';
import { overlayCommand, twatermarkCommand, watermarkCommand } from './watermarks';
import { formatCommand } from './format';
import { adjustmentCommand } from './adjustment';
import { patchImage } from './patch-image';
import { wallpaperCommand } from './wallpaper';
import { aiCommand } from './ai';
import { translateCommand } from './translate';

const commands = {
  'start': startCommand,
  'help': helpCommand,
  'overlay': overlayCommand,
  'watermark': watermarkCommand,
  'twatermark': twatermarkCommand,
  'format': formatCommand,
  'adjustment': adjustmentCommand,
  'patchimage': patchImage,
  'wallpaper': wallpaperCommand,
  'ai': aiCommand,
  'translate': translateCommand
}

export function injectCommands(bot: Telegraf) {
  for (const [name, handlerFactory] of Object.entries(commands)) {
    bot.command(name, handlerFactory());
  }
}
export * from './start';
export * from './help';
export * from './watermarks';
export * from './format';
export * from './adjustment';
export * from './patch-image';
export * from './wallpaper';
export * from './ai'
export * from './translate';