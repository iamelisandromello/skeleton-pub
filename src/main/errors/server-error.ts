export class ServerError extends Error {
  private readonly statusCode: number
  constructor(error?: Error) {
    super('Server failed. Try again soon')
    this.name = 'ServerError'
    this.stack = error?.stack
    this.statusCode = 500
  }
}
