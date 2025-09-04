import { VercelRequest, VercelResponse } from '@vercel/node';
import { startVercel } from '../scripts/vercel';

export default async function handle(req: VercelRequest, res: VercelResponse) {
  await startVercel(req, res);
}
