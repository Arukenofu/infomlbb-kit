import { JimpReadType } from '../types/jimp-types';
import { Alignments } from '../enums/Alignments';

function calculateCoordinates(
  align: Alignments | number,
  parentSize: number,
  childSize: number
) {
  if (typeof align === 'number') {
    return parentSize * align - childSize / 2;
  }

  switch (align) {
    case Alignments.Left:
    case Alignments.Top:
      return 0;
    case Alignments.Center:
      return (parentSize - childSize) / 2;
    case Alignments.Right:
    case Alignments.Bottom:
      return parentSize - childSize;
    default:
      return (parentSize - childSize) / 2;
  }
}

function calculateElementsPosition(
  parent: JimpReadType,
  child: JimpReadType,
  xAlign: Alignments | number,
  yAlign: Alignments | number
) {
  const x = calculateCoordinates(xAlign, parent.bitmap.width, child.bitmap.width);
  const y = calculateCoordinates(yAlign, parent.bitmap.height, child.bitmap.height);

  return { x, y };
}

export {
  calculateCoordinates,
  calculateElementsPosition,
}