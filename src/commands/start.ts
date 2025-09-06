import { createCommandHandler } from '../core/handlers/command';
import { dedent } from '../shared/helpers/dedent';

export default createCommandHandler('start', async (context) => {
  await context.reply(dedent(`
    Привет! Это бот от Баура, для автоматизации работы публикации постов с информатора
    
    Для того, чтобы получить инструкции напишите команду: /help`
  )).catch();
})