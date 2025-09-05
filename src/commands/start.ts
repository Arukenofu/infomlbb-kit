import { createCommandHandler } from '../core/handlers/command.ts';
import { dedent } from '../shared/helpers/dedent.ts';

export default createCommandHandler('start', async (context) => {
  await context.reply(dedent(`
    Привет! Это бот от Баура, для автоматизации работы публикации постов с информатора
    
    Для того, чтобы получить инструкции напишите команду: /help`
  )).catch();
})