import { Telegraf } from 'telegraf';
import { MediaGroup, photo_media_group } from '@dietime/telegraf-media-group';
import { VercelRequest, VercelResponse } from '@vercel/node';

import { development, production } from './core';

import { injectCommands } from './commands';
import { onMediaGroup, onPhoto } from './events';
import { message } from 'telegraf/filters';

const ENVIRONMENT = process.env.NODE_ENV || '';

const bot = new Telegraf(process.env.BOT_TOKEN || '');
bot.use(new MediaGroup({timeout: 1000}).middleware());

injectCommands(bot);

bot.on(photo_media_group(), onMediaGroup());
bot.on(message('photo'), onPhoto());

export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  await production(req, res, bot);
};

ENVIRONMENT !== 'production' && development(bot);