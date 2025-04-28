import type { MiddlewareInterface } from '@/main/config/middlewares'

export interface MiddlewareManagerInterface<T, R> {
  execute: (request: T) => Promise<R>
  use: (middlewares: Array<MiddlewareInterface<T, R>>) => void
  handleError: (error: unknown) => Promise<R>
}
