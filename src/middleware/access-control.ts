import { Context } from "telegraf";

const allowedUsers = [1980811472, 779453451, 5276321047, 874192537];

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