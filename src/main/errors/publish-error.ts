export class PublishError extends Error {
  private readonly statusCode: number
  constructor(error?: Error) {
    super('Error publishing to queue')
    this.name = 'PublishError'
    this.stack = error?.stack
    this.statusCode = 500
  }
}
