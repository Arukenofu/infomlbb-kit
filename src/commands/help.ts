import { Context } from 'telegraf';

const message =
`
<b>Подробнее</b>
https://infomlbb-docs.vercel.app/
`

const helpCommand = () => async (context: Context) => {
  await context.sendMessage(message, {
    parse_mode: 'HTML'
  }).catch();
}

export {helpCommand};