export class InvalidParamError extends Error {
  private readonly statusCode: number
  constructor(paramName: string) {
    super(`Invalid param: ${paramName}`)
    this.name = 'InvalidParamError'
    this.statusCode = 400
  }
}
