import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { onPhoto } from './photo';

export function injectEvents(bot: Telegraf) {
  bot.on(message('photo'), onPhoto());
}

export * from './media-group';
export * from './photo';