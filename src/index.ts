import { Telegraf } from 'telegraf';

import {startCommand} from './commands'

import { VercelRequest, VercelResponse } from '@vercel/node';
import { development, production } from './core';
import * as fs from 'node:fs';

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const ENVIRONMENT = process.env.NODE_ENV || '';

const bot = new Telegraf(BOT_TOKEN);

bot.command('start', startCommand());

bot.on('message', async message => {
  ENVIRONMENT !== 'production' && fs.writeFileSync('log.json', JSON.stringify(message, null, 2))
});

export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  await production(req, res, bot);
};

ENVIRONMENT !== 'production' && development(bot);