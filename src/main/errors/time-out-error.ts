export class TimeOutError extends Error {
  private readonly statusCode: number
  constructor() {
    super('Completion of the process by waiting time!!')
    this.name = 'TimeOutError'
    this.statusCode = 408
  }
}
