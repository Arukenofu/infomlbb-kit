import { createPatchNodeTree, renderPatchHTML } from '../actions/format-patchnotes';
import { splitMessage } from '../processes/split-message';
import { createCommandHandler } from '../core/handlers/command.ts';
import { getPayload } from '../shared/helpers/getPayload.ts';

export default createCommandHandler('format', async (context) => {
  const payload = getPayload(context.message?.text || '');

  const tree = createPatchNodeTree(String(payload), {});
  const output = renderPatchHTML(tree);

  const chunks = splitMessage(output);

  for (const chunk of chunks) {
    chunk && await context.reply(chunk, {
      parse_mode: 'HTML'
    });
  }
})