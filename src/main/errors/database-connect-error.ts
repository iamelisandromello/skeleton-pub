export class DatabaseConnectError extends Error {
  constructor() {
    super('Connect error database!!')
    this.name = 'DatabaseConnectError'
  }
}
