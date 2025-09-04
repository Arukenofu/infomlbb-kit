import './shared/extensions';

import { Telegraf } from 'telegraf';

import { development, production } from './core';

import { injectCommands } from './commands';
import { injectEvents } from './events';
import { injectMiddleware } from './middleware';
import { isProduction } from './shared/constants/isProduction';

const bot = new Telegraf(process.env.BOT_TOKEN);

console.log(isProduction);

injectMiddleware(bot);
injectCommands(bot);
injectEvents(bot);

isProduction ? production(bot) : development(bot);