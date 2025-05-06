import { Context } from 'telegraf';

const message = 'Привет! Это бот от Баура, для автоматизации работы публикации постов с информатора' +
  '\n\n' +
  'Для того, чтобы получить инструкции напишите команду: /help'

const startCommand = () => async (context: Context) => {
  await context.sendMessage(message).catch();
}

export {startCommand};