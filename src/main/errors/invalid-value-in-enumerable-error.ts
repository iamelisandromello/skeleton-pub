export class InvalidValueInEnumerableError extends Error {
  private readonly statusCode: number
  constructor() {
    super('Invalid value for enumerable!!')
    this.name = 'InvalidValueInEnumerableError'
    this.statusCode = 422
  }
}
