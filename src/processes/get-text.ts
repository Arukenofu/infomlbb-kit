import { Context } from 'grammy';
import { parseInput } from '../shared/helpers/parse-input.ts';

export function getText(context: Context) {
  return context.message?.text || context.message?.caption || "";
}

export function parseInputText(context: Context) {
  return parseInput(getText(context));
}