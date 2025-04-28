export interface MiddlewareErrorHandlerInterface<T> {
  handle: (error: unknown) => T
}
