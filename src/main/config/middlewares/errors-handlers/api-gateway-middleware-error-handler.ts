import { cors } from '@/main/config/cors'
import type { MiddlewareErrorHandlerInterface } from '@/main/config/middlewares'

import type { APIGatewayProxyResult } from 'aws-lambda'

export class ApiGatewayMiddlewareErrorHandler
  implements MiddlewareErrorHandlerInterface<APIGatewayProxyResult>
{
  handle(error: unknown): APIGatewayProxyResult {
    console.error('[UNEXPECTED ERROR]:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: (error as { name?: string })?.name ?? 'Unexpected error.'
      }),
      headers: cors()
    }
  }
}
