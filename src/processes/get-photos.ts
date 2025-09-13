import { Context } from 'grammy';

export function getPhotos(context: Context) {
  return context.message?.photo || context.message?.reply_to_message?.photo;
}