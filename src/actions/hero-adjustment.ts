import { Images } from '../shared/enums/images';

const adjustmentCommands = {
  buff: ['бафф', 'усиление', '+'],
  nerf: ['нерф', 'ослабление', '-'],
  adjustment: ['изменение', '=']
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

export {adjustmentCommands, getAdjustmentLinkByPayload}