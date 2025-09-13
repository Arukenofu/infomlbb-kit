import { Bot } from 'grammy';
import { middlewares } from '../.generated/middlewares';
import { commands } from '../.generated/commands';
import { filters } from '../.generated/filters';
import { events } from '../.generated/events';
import { handleError } from './handlers/error';

export { telegram } from "./telegram";

export function createBot() {
  const bot = new Bot(process.env.BOT_TOKEN);

  for (const middleware of middlewares) {
    bot.use(middleware);
  }

  for (const command of commands) {
    bot.command(command.name, command.handlerFn);
  }

  for (const filter of filters) {
    const { predicateFn, handlerFn } = filter;
    // @ts-ignore
    bot.filter(predicateFn, handlerFn);
  }

  for (const event of events) {
    bot.on(event.name, event.handlerFn);
  }

  bot.catch(async ({error, ctx}) => {
    try {
      error && await handleError(error);
      await handleError(ctx);

      try {
        await ctx.reply('Произошла неизвестная ошибка')
      } catch (_) {}
    } catch (_) {}
  });

  return bot;
}