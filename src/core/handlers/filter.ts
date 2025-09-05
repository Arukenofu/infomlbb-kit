import { Context, Middleware } from 'grammy';

export interface CreateFilterHandlerReturnType {
  predicateFn: (context: Context) => Promise<boolean> | boolean,
  handlerFn: Middleware<Context>
}

export const createFilterHandler = <T extends Context> (
  predicateFn: (context: Context) => context is T,
  handlerFn: Middleware<T>
) => ({
  predicateFn: predicateFn,
  handlerFn: handlerFn,
});