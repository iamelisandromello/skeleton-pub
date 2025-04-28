export class InvalidPhoneError extends Error {
  private readonly statusCode: number
  constructor() {
    super('Invalid Phone Error')
    this.name = 'InvalidPhoneError'
    this.statusCode = 422
  }
}
