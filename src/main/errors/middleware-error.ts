export class MiddlewareError extends Error {
  private readonly statusCode: number
  constructor() {
    super('Next middleware not defined')
    this.name = 'MiddlewareError'
    this.statusCode = 500
  }
}
