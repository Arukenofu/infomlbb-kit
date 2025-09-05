import { Telegraf } from 'telegraf';
import { mediaGroupMiddleware } from './media-group';
import { accessControlMiddleware } from './access-control';

export function injectMiddleware(bot: Telegraf) {
  bot.use(mediaGroupMiddleware);
  bot.use(accessControlMiddleware);
}

export * from './access-control';
export * from './media-group';