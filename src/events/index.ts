import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { onPhoto } from './photo';
import { photo_media_group } from '@dietime/telegraf-media-group';
import { onMediaGroup } from './media-group';
import { onText } from './text';

export function injectEvents(bot: Telegraf) {
  bot.on(message('photo'), onPhoto());
  bot.on(photo_media_group(), onMediaGroup());
  bot.on(message('text'), onText());
}

export * from './media-group';
export * from './photo';
export * from './text'