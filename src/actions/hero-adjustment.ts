import { Images } from '../shared/enums/images';
import { Context } from 'telegraf';
import { getPhotolink } from '../shared/helpers/get-photolink';
import { getWallpaper } from '../shared/helpers/get-wallpaper';
import { translateHero } from '../shared/helpers/translate-hero';

const adjustmentCommands = {
  buff: ['бафф', 'усиление', '+'],
  nerf: ['нерф', 'ослабление', '-'],
  adjustment: ['изменения', 'изменение', '=']
}

async function getAdjustmentParameters(
  context: Context
) {
  if (('photo' in context.message!)) {
    const imageLink = await getPhotolink(context.message.photo, context.telegram);
    const adjustmentCommand = String(context.message.caption?.split(' ')[1] || '').toLowerCase();

    return {imageLink, adjustmentCommand};
  }

  const text = context.text || '';
  const [_, adjustmentCommand, hero] = text.split(' ');

  const translatedHero = translateHero(hero || '', 'en');
  const imageLink = await getWallpaper(translatedHero);

  return {imageLink, adjustmentCommand};
}

function getAdjustmentLinkByPayload(
  payload: string,
) {
  if (adjustmentCommands.buff.includes(payload)) {
    return Images.BUFF
  } else if (adjustmentCommands.nerf.includes(payload)) {
    return Images.NERF
  } else if (adjustmentCommands.adjustment.includes(payload)) {
    return Images.ADJUSTMENT
  } else {
    return null;
  }
}

async function sendFormattedHeroAdjustmentText(context: Context, command: string) {
  const findAdjustmentEntry = (payload: string) => {
    for (const commands of Object.values(adjustmentCommands)) {
      if (commands.includes(payload)) {
        return commands[1];
      }
    }
    return undefined;
  }

  await context.sendMessage(`
<b>${context?.text?.split(' ')?.[2] || 'имя_героя'} получит <u>${findAdjustmentEntry(command)}</u> в следующем обновлении</b>

#MLBB #MobileLegends #Mobile_Legends #MLBB_Other`, {parse_mode: 'HTML'});
}

export {adjustmentCommands, getAdjustmentLinkByPayload, getAdjustmentParameters, sendFormattedHeroAdjustmentText}