export class InvalidCPFError extends Error {
  private readonly statusCode: number
  constructor() {
    super('Invalid CPF Error')
    this.name = 'InvalidCPFError'
    this.statusCode = 400
  }
}
