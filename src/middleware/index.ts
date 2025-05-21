import { Telegraf } from 'telegraf';

export function injectMiddleware(bot: Telegraf) {
  // bot.use(accessControlMiddleware);
}

export * from './access-control';
export * from './media-group';