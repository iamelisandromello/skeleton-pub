export class MicroserviceError extends Error {
  private readonly statusCode: number
  constructor(error: string) {
    super(`MicroserviceError: ${error}`)
    this.name = 'MicroserviceError'
    this.statusCode = 500
  }
}
