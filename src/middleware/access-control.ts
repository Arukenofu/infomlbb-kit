import { Context } from "telegraf";

const allowedUsers = [123456789, 987654321];

async function accessControlMiddleware (
  context: Context,
  next: Function
) {
  const userId = context.from?.id || 0;

  if (allowedUsers.includes(userId)) {
    return next();
  }

  await context.sendMessage('Вы не добавлены в список разрешённых пользователей');

  return;
}

export { accessControlMiddleware };