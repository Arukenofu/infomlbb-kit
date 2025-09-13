import { XAlignments, YAlignments } from '../../shared/enums/Alignments';

export interface IAlignments {
  xAlign?: XAlignments | number;
  yAlign?: YAlignments | number;
}

interface Error {
  error: string;
}

function parseAlignCommands(args: string[]): IAlignments | Error {
  const aligns: IAlignments = {};

  const isXAlignment = (val: string): val is XAlignments =>
    Object.values(XAlignments).includes(val as XAlignments);

  const isYAlignment = (val: string): val is YAlignments =>
    Object.values(YAlignments).includes(val as YAlignments);

  const isNumeric = (val: string): boolean => !isNaN(Number(val));

  const toNumber = (val: string): number => Number(val) / 100;

  if (!args.length) {
    return aligns;
  }

  if (args.length === 1) {
    const value = args[0];

    if (isNumeric(value) && (Number(value) > 100 || Number(value) < 0)) {
      return { error: 'Задан неправильный числовой параметр, выберите от 0 до 100' };
    }

    if (isXAlignment(value)) {
      aligns.xAlign = value;
    } else if (isYAlignment(value)) {
      aligns.yAlign = value;
    } else if (isNumeric(value)) {
      aligns.xAlign = toNumber(value);
    } else {
      return { error: 'Задан неправильный параметр' };
    }
  }

  if (args.length === 2) {
    const [xVal, yVal] = args;

    if (isXAlignment(xVal)) {
      aligns.xAlign = xVal;
    } else if (isNumeric(xVal)) {
      aligns.xAlign = toNumber(xVal);
    } else {
      return { error: 'Неверный параметр для X-выравнивания' };
    }

    if (isYAlignment(yVal)) {
      aligns.yAlign = yVal;
    } else if (isNumeric(yVal)) {
      aligns.yAlign = toNumber(yVal);
    } else {
      return { error: 'Неверный параметр для Y-выравнивания' };
    }
  }

  return aligns;
}


export { parseAlignCommands }