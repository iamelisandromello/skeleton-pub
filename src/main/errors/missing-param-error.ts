export class MissingParamError extends Error {
  private readonly statusCode: number
  constructor(paramName: string) {
    super(`Missing param: ${paramName}`)
    this.name = 'MissingParamError'
    this.statusCode = 400
  }
}
