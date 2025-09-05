import { createCommandHandler } from '../core/handlers/command.ts';
import { Context } from 'grammy';
import { parseAlignCommands } from '../actions/watermark/align.ts';
import { processImage } from '../processes/process-watermark.ts';
import { createWatermark } from '../actions/watermark/createTWatermark.ts';
import { createOverlay } from '../actions/watermark/createOverlay.ts';
import { BlendMode } from 'jimp';
import { has } from '../shared/helpers/object-has.ts';
import { parseInputText } from '../processes/get-text.ts';

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