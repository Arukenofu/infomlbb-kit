import './shared/extensions';

import { Telegraf } from 'telegraf';
import { VercelRequest, VercelResponse } from '@vercel/node';

import { development, production } from './core';

import { injectCommands } from './commands';
import { injectEvents } from './events';
import { injectMiddleware } from './middleware';

const ENVIRONMENT = process.env.NODE_ENV;

const bot = new Telegraf(process.env.BOT_TOKEN);

injectMiddleware(bot);
injectCommands(bot);
injectEvents(bot);

ENVIRONMENT !== 'production' && development(bot);