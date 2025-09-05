import { Context } from 'grammy';

export function splitMessage(text: string, chunkSize = 4000): string[] {
  const parts: string[] = [];
  let current = '';

  for (const line of text.split('\n')) {
    if ((current + '\n' + line).length > chunkSize) {
      parts.push(current);
      current = line;
    } else {
      current += (current ? '\n' : '') + line;
    }
  }
  if (current) parts.push(current);

  return parts;
}

export async function splitAndSendMessage(text: string, ctx: Context) {
  const messages = splitMessage(text);

  for (const msg of messages) {
    await ctx.reply(msg);
  }
}