export class UnauthorizedError extends Error {
  private readonly statusCode: number
  constructor() {
    super('Authentication failure, unauthorized credentials')
    this.name = 'UnauthorizedError'
    this.statusCode = 401
  }
}
