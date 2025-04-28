export class InvalidRouteError extends Error {
  private readonly statusCode: number
  constructor() {
    super('Informed route is invalid!!')
    this.name = 'InvalidRouteError'
    this.statusCode = 404
  }
}
