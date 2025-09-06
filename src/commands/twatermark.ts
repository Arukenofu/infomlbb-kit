import { createCommandHandler } from '../core/handlers/command';
import { Context } from 'grammy';
import { parseAlignCommands } from '../actions/watermark/align';
import { processImage } from '../processes/process-watermark';
import { createWatermark } from '../actions/watermark/createTWatermark';
import { createOverlay } from '../actions/watermark/createOverlay';
import { BlendMode } from 'jimp';
import { has } from '../shared/helpers/object-has';
import { parseInputText } from '../processes/get-text';

export default createCommandHandler("twatermark", async (context: Context) => {
  const { args } = parseInputText(context);
  const aligns = await parseAlignCommands(args);

  if (has(aligns, 'error')) return context.reply('Ошибка вычисления координат вотермарки')

  await processImage(context, async (photoLink) =>
    createWatermark(await createOverlay(photoLink), {
      blendMode: BlendMode.OVERLAY,
      ...aligns,
    })
  );
});