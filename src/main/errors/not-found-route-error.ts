export class NotFoundRouteError extends Error {
  private readonly statusCode: number
  constructor() {
    super('Informed route not found!!')
    this.name = 'NotFoundRouteError'
    this.statusCode = 404
  }
}
