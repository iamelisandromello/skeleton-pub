import type {
  MiddlewareInterface,
  MiddlewareManagerInterface,
  MiddlewareErrorHandlerInterface
} from '@/main/config/middlewares'

export class MiddlewareManager<T, R>
  implements MiddlewareManagerInterface<T, R>
{
  private middlewares: Array<MiddlewareInterface<T, R>>
  private head: MiddlewareInterface<T, R> | null
  private readonly errorHandler: MiddlewareErrorHandlerInterface<R>

  constructor(errorHandler: MiddlewareErrorHandlerInterface<R>) {
    this.middlewares = []
    this.head = null
    this.errorHandler = errorHandler
  }

  setUp(): void {
    if (this.middlewares.length > 1) {
      for (let i = 0; i < this.middlewares.length - 1; i++) {
        if (i === 0) {
          this.head = this.middlewares[i]
        }
        this.middlewares[i].next = this.middlewares[i + 1]
      }
    } else if (this.middlewares.length === 1) {
      this.head = this.middlewares[0]
    }
  }

  async execute(request: T): Promise<R> {
    this.setUp()

    try {
      if (!this.head) throw new Error('Middleware not defined')
      return await this.head.handle(request)
    } catch (error) {
      return this.handleError(error)
    }
  }

  use(middlewares: Array<MiddlewareInterface<T, R>>): void {
    this.middlewares = [...this.middlewares, ...middlewares]
  }

  async handleError(error: unknown): Promise<R> {
    return this.errorHandler.handle(error)
  }
}
