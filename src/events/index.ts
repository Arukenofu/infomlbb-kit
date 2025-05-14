import { Telegraf } from 'telegraf';
import { photo_media_group } from '@dietime/telegraf-media-group';
import { onMediaGroup } from './media-group';
import { message } from 'telegraf/filters';
import { onPhoto } from './photo';

export function injectEvents(bot: Telegraf) {
  bot.on(photo_media_group(), onMediaGroup());
  bot.on(message('photo'), onPhoto());
}

export * from './media-group';
export * from './photo';