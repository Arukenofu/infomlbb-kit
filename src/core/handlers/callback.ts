import { MaybeArray } from 'grammy/out/context';
import { CallbackQueryMiddleware, Context } from 'grammy';

export interface CreateCallbackHandlerReturnType {
  trigger: MaybeArray<string | RegExp>,
  cb: CallbackQueryMiddleware<Context>
}

export const createCallbackHandler = (
  trigger: MaybeArray<string | RegExp>,
  cb: CallbackQueryMiddleware<Context>
): CreateCallbackHandlerReturnType => ({
  trigger, cb
})