import { Context } from 'telegraf';

const message =
`
<b>Базовые Команды</b>
<code>/start</code> - Приветственное сообщение

<b>Работа с изображением</b>
<code>/overlay</code> - Прикрепить вотермарку с оверлеем к отправленному изображению
<code>/watermark</code> - Прикрепить обычную вотермарку к отправленному изображению
<code>/twatermark</code> - Прикрепить оверлей и обычную вотермарку к отправленному изображению

<b>Работа с патчнотами</b>
<code>/format [текст патчнотов]</code> - Форматирование патчнотов
`

const helpCommand = () => async (context: Context) => {
  await context.sendMessage(message, {
    parse_mode: 'HTML'
  }).catch();
}

export {helpCommand};