import type { MiddlewareErrorHandlerInterface } from '@/main/config/middlewares'

export class SqsMiddlewareErrorHandler
  implements MiddlewareErrorHandlerInterface<undefined>
{
  handle(error: unknown): undefined {
    throw error
  }
}
