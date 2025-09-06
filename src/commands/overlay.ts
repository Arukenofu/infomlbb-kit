import { createCommandHandler } from '../core/handlers/command';
import { processImage } from '../processes/process-watermark';
import { createOverlay } from '../actions/watermark/createOverlay';
import { Context } from 'grammy';

export default createCommandHandler("overlay", async (context: Context) => {
  await processImage(context, (photoLink) => createOverlay(photoLink));
});