import { StringWithCommandSuggestions } from 'grammy/out/context';
import { CommandMiddleware, Context } from 'grammy';

export interface CreateCommandHandlerReturnType {
  name: StringWithCommandSuggestions;
  handlerFn: CommandMiddleware<Context>
}

export const createCommandHandler = (
  name: StringWithCommandSuggestions,
  handlerFn: CommandMiddleware<Context>
) => ({
  name: name,
  handlerFn: handlerFn,
});