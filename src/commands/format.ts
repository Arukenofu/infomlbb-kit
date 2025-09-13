import {
  formatPatchNotes,
} from '../actions/format-patchnotes';
import { splitMessage } from '../processes/split-message';
import { createCommandHandler } from '../core/handlers/command';
import { getPayload } from '../shared/helpers/getPayload';

export default createCommandHandler('format', async (context) => {
  const payload = getPayload(context.message?.text || '');

  const output = formatPatchNotes(String(payload), {
    useAutoEmoji: false
  });

  const chunks = splitMessage(output);

  for (const chunk of chunks) {
    chunk && await context.reply('```html\n' + chunk + '```', {
      parse_mode: 'MarkdownV2'
    });
  }
})