import { parseInput } from '../shared/helpers/parse-input';
import { createEventHandler } from '../core/handlers/events';
import overlay from '../commands/overlay';
import watermark from '../commands/watermark';
import twatermark from '../commands/twatermark';
import adjustment from '../commands/adjustment';
import translate from '../commands/translate';
import ai from '../commands/ai';
import { createCommandHandler } from '../core/handlers/command';

type Command = ReturnType<typeof createCommandHandler>

const commands: Record<string, Command> = {
  '/overlay': overlay,
  '/watermark': watermark,
  '/twatermark': twatermark,
  '/adjustment': adjustment,
  '/patch': translate,
  '/ai': ai
};

export default createEventHandler(['message:photo'], async (context) => {
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