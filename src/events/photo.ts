import { parseInput } from '../shared/helpers/parse-input';
import { createEventHandler } from '../core/handlers/events.ts';
import overlay from '../commands/overlay.ts';
import watermark from '../commands/watermark.ts';
import twatermark from '../commands/twatermark.ts';
import adjustment from '../commands/adjustment.ts';
import translate from '../commands/translate.ts';
import ai from '../commands/ai.ts';
import { createCommandHandler } from '../core/handlers/command.ts';

type Command = ReturnType<typeof createCommandHandler>

const commands: Record<string, Command> = {
  '/overlay': overlay,
  '/watermark': watermark,
  '/twatermark': twatermark,
  '/adjustment': adjustment,
  '/patch': translate,
  '/ai': ai
};

export default createEventHandler('message:photo', async (context) => {
  const caption = context.message.caption || '';
  const {command} = parseInput(caption);

  if (command && commands[command]) {
    const fn = commands[command]?.handlerFn
    // @ts-ignore
    fn(context)
  } else {
    // @ts-ignore
    twatermark.handlerFn(context);
  }
})