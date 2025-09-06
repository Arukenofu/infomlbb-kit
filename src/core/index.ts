import { Bot } from 'grammy';
import { middlewares } from '../.generated/middlewares';
import { commands } from '../.generated/commands';
import { filters } from '../.generated/filters';
import { events } from '../.generated/events';

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
    bot.filter(predicateFn, handlerFn);
  }

  for (const event of events) {
    bot.on(event.name, event.handlerFn);
  }

  bot.catch(({error, ctx}) => {
    try {
      error && bot.api.sendMessage(779453451, JSON.stringify(error))
      bot.api.sendMessage(779453451, JSON.stringify(ctx, null, 2))
    } catch (_) {}
  });

  return bot;
}