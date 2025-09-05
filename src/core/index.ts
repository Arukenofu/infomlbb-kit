import { Bot } from 'grammy';
import { middlewares } from '../.generated/middlewares.ts';
import { commands } from '../.generated/commands.ts';
import { filters } from '../.generated/filters.ts';
import { events } from '../.generated/events.ts';

export { telegram } from "./telegram.ts";

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

  return bot;
}