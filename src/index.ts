import { Telegraf } from 'telegraf';
import { VercelRequest, VercelResponse } from '@vercel/node';

import { development, production } from './core';

import { injectCommands } from './commands';
import { injectEvents, onMediaGroup } from './events';
import { injectMiddleware, mediaGroupMiddleware } from './middleware';
import { photo_media_group } from '@dietime/telegraf-media-group';

const ENVIRONMENT = process.env.NODE_ENV || '';

const bot = new Telegraf(process.env.BOT_TOKEN || '');

bot.use(mediaGroupMiddleware);
bot.on(photo_media_group(), onMediaGroup());

injectMiddleware(bot);
injectCommands(bot);
injectEvents(bot);

export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  await production(req, res, bot);
};

ENVIRONMENT !== 'production' && development(bot);