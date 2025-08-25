import { Context } from 'telegraf';

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

export function splitAndSendMessage(text: string, context: Context) {
  const messages = splitMessage(text);

  for (const msg of messages) {
    context.reply(msg);
  }
}


