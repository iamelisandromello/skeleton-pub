export class IntegrationHubApiError extends Error {
  constructor(error?: Error) {
    super('Communication error with the Hub API. Get in touch with Data Team')
    this.name = 'IntegrationHubApiError'
    this.stack = error?.stack
  }
}
