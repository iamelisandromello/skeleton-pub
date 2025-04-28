export class NotFoundError extends Error {
  private readonly statusCode: number
  constructor(name: string) {
    super(`${name} not found`)
    this.name = 'NotFoundError'
    this.statusCode = 404
  }
}
