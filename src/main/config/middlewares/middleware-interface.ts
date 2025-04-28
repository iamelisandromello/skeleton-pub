export interface MiddlewareInterface<T, R> {
  next: MiddlewareInterface<T, R>
  handle: (request: T) => Promise<R>
}
