import { createCommandHandler } from '../core/handlers/command.ts';
import { processImage } from '../processes/process-watermark.ts';
import { createOverlay } from '../actions/watermark/createOverlay.ts';
import { Context } from 'grammy';

export default createCommandHandler("overlay", async (context: Context) => {
  await processImage(context, (photoLink) => createOverlay(photoLink));
});