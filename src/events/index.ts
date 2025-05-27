import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { onPhoto } from './photo';
import { photo_media_group } from '@dietime/telegraf-media-group';
import { onMediaGroup } from './media-group';

export function injectEvents(bot: Telegraf) {
  bot.on(message('photo'), onPhoto());
  bot.on(photo_media_group(), onMediaGroup());
}

export * from './media-group';
export * from './photo';