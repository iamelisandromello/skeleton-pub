import { cors } from '@/main/config/cors'
import type { Controller } from '@/presentation/controllers/controller-abstract'
import type { HttpResponse, HttpRequest } from '@/presentation/helpers/http'
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from 'aws-lambda/trigger/api-gateway-proxy'

export class AdapterLambda {
  constructor(private readonly controller: Controller) {}

  async handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const body = JSON.parse(event.body ?? '{}')
    const query = event.queryStringParameters ?? {}

    // @todo: add support to path params
    const request: HttpRequest = { query, body, path: null }
    //const request = this.parseRequest(event.body)

    const httpResponse = await this.controller.perform(request)

    return {
      statusCode: httpResponse.statusCode,
      body: this.formatResponse(httpResponse),
      headers: cors()
    }
  }

  private parseRequest(body: string | null): Record<string, unknown> {
    return body ? JSON.parse(body) : {}
  }

  private formatResponse(httpResponse: HttpResponse): string {
    const data = this.isSuccessful(httpResponse.statusCode)
      ? this.formatSuccessData(httpResponse.data)
      : this.formatErrorData(httpResponse.data)

    return JSON.stringify(data)
  }

  private isSuccessful(statusCode: number): boolean {
    return statusCode >= 200 && statusCode <= 299
  }

  private formatSuccessData(data: unknown): object {
    if (typeof data === 'object' && data !== null) {
      return data
    }
    return { message: 'Invalid data format' }
  }

  private formatErrorData(data: unknown): { error: string } {
    if (typeof data === 'object' && data !== null && 'message' in data) {
      return { error: (data as { message: string }).message }
    }
    return { error: 'Unknown error' }
  }
}
