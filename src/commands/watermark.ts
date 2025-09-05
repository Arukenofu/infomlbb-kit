import { createCommandHandler } from '../core/handlers/command.ts';
import { parseAlignCommands } from '../actions/watermark/align.ts';
import { has } from '../shared/helpers/object-has.ts';
import { processImage } from '../processes/process-watermark.ts';
import { createWatermark } from '../actions/watermark/createTWatermark.ts';
import { Context } from 'grammy';
import { parseInputText } from '../processes/get-text.ts';

export default createCommandHandler("watermark", async (context: Context) => {
  const { args } = parseInputText(context);
  const aligns = await parseAlignCommands(args);

  if (has(aligns, "error")) return;

  await processImage(context, (photoLink) =>
    createWatermark(photoLink, { ...aligns })
  );
});