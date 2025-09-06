import { createCommandHandler } from '../core/handlers/command';
import { parseAlignCommands } from '../actions/watermark/align';
import { has } from '../shared/helpers/object-has';
import { processImage } from '../processes/process-watermark';
import { createWatermark } from '../actions/watermark/createTWatermark';
import { Context } from 'grammy';
import { parseInputText } from '../processes/get-text';

export default createCommandHandler("watermark", async (context: Context) => {
  const { args } = parseInputText(context);
  const aligns = await parseAlignCommands(args);

  if (has(aligns, "error")) return;

  await processImage(context, (photoLink) =>
    createWatermark(photoLink, { ...aligns })
  );
});