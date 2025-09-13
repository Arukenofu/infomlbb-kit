import { telegram } from '../telegram';

export function handleError(data: unknown) {
  return telegram.sendMessage(779453451, JSON.stringify(data, null, 2));
}