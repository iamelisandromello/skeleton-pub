export class UnavailableError extends Error {
  private readonly statusCode: number
  constructor() {
    super('The server is not ready to handle the request.')
    this.name = 'UnavailableError'
    this.statusCode = 503
  }
}
