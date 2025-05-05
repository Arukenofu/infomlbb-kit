import { Context } from 'telegraf';

const startCommand = () => async (context: Context) => {
  const message = 'Привет! Это бот от Баура, для автоматизации работы публикации постов с информатора' +
    '\n\n' +
    'Для того, чтобы получить инструкции напишите команду: /help'

  await context.sendMessage(message)
}

export {startCommand};