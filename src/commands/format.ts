import { Context } from 'telegraf';
import { createPatchNodeTree, renderPatchHTML } from '../actions/format-patchnotes';
import { splitMessage } from '../processes/split-message';

const formatCommand = () => async (
  context: Context
) => {
  if (!('payload' in context)) {
    await context.sendMessage('Текст патчнотов не задан'); return;
  }

  const tree = createPatchNodeTree(String(context.payload), {

  });
  const output = renderPatchHTML(tree);

  const chunks = splitMessage(output.trim());

  for (const chunk of chunks) {
    chunk && await context.sendMessage(chunk, {
      parse_mode: 'HTML'
    });
  }
}

export {formatCommand}