import { Images } from '../../shared/enums/images';
import { dedent } from '../../shared/helpers/dedent';
import { adjustmentCommands } from './commands';

function getAdjustmentLinkByPayload(payload: string) {
  if (adjustmentCommands.buff.includes(payload)) {
    return Images.BUFF;
  } else if (adjustmentCommands.nerf.includes(payload)) {
    return Images.NERF;
  } else if (adjustmentCommands.adjustment.includes(payload)) {
    return Images.ADJUSTMENT;
  } else {
    return null;
  }
}

async function getFormattedHeroAdjustmentText(hero: string, command: string) {
  const findAdjustmentEntry = (payload: string) => {
    for (const commands of Object.values(adjustmentCommands)) {
      if (commands.includes(payload)) {
        return commands[1];
      }
    }
    return undefined;
  };

  return dedent(`
    <b>${hero.replace('-', ' ').toCapitalizeWords() || 'имя_героя'} получит <u>${findAdjustmentEntry(command)}</u> в следующем обновлении</b>

    #MLBB #MobileLegends #Mobile_Legends #MLBB_Other`);
}

export { getAdjustmentLinkByPayload, getFormattedHeroAdjustmentText };