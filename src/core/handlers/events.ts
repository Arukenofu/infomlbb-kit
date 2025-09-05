import { Context, Filter, FilterQuery, Middleware } from 'grammy';

export interface CreateEventHandlerReturnType {
  name: FilterQuery,
  handlerFn: Middleware<Filter<Context, FilterQuery>>
}

export const createEventHandler = <T extends FilterQuery>(
  name: T | T[],
  handlerFn: Middleware<Filter<Context, T>>
) => ({ name, handlerFn });
