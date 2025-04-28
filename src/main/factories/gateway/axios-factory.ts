import { AxiosHttpClient } from '@/infra/gateway/http'

export class AxiosHttpClientFactory {
  private static instance: AxiosHttpClientFactory
  private instanceAxiosHttpClient: AxiosHttpClient | undefined

  public static getInstance(): AxiosHttpClientFactory {
    if (!AxiosHttpClientFactory.instance) {
      AxiosHttpClientFactory.instance = new AxiosHttpClientFactory()
    }

    return AxiosHttpClientFactory.instance
  }

  public make(): AxiosHttpClient {
    if (!this.instanceAxiosHttpClient) {
      this.instanceAxiosHttpClient = new AxiosHttpClient()
    }
    return this.instanceAxiosHttpClient
  }
}
