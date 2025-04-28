export class NotFoundUserError extends Error {
  private readonly statusCode: number
  constructor(email: string) {
    super(`${email} not found`)
    this.name = 'NotFoundUserError'
    this.statusCode = 404
  }
}
