import { Context, Middleware } from 'grammy';

export const createMiddlewareHandler = (
  ...functions: Middleware<Context>[]
): Middleware<Context>[] => {
  return functions;
};