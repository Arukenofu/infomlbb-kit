import { createCommandHandler } from '../core/handlers/command';

const message =
`
<b>Подробнее</b>
https://infomlbb-docs.vercel.app/
`

export default createCommandHandler('help', async (context) => {
  await context.reply(message, {
    parse_mode: 'HTML'
  }).catch();
})