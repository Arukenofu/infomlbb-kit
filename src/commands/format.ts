import { Context } from 'telegraf';
import { formatPatchNotes } from '../actions/format-patchnotes';

const formatCommand = () => async (
  context: Context
) => {
  if (!('payload' in context)) {
    await context.sendMessage('Текст патчнотов не задан');
    return;
  }

  const output = formatPatchNotes(String(context.payload));

  output.trim() && await context.sendMessage(output, {
    parse_mode: 'HTML'
  });
}

export {formatCommand}