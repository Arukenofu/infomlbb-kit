import { JimpReadType } from '../types/jimp-types';
import { Alignments, XAlignments, YAlignments } from '../enums/Alignments';

function calculateCoordinates(
  align: Alignments | number,
  parentSize: number,
  childSize: number
) {
  if (typeof align === 'number') {
    return parentSize * align - childSize / 2;
  }

  switch (align) {
    case XAlignments.Left:
    case YAlignments.Top:
      return 0;
    case XAlignments.Center:
    case YAlignments.Center:
      return (parentSize - childSize) / 2;
    case XAlignments.Right:
    case YAlignments.Bottom:
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