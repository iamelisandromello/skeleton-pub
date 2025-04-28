export class TimeOutException extends Error {
  constructor() {
    super('Completion of the process by waiting time!!')
    this.name = 'TimeOutError'
  }
}
