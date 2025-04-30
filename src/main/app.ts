import './config/module-alias'
import { ApiGatewayMiddlewareManagerFactory } from '@/main/factories/middleware-managers'
import { AppRoutesFactory } from '@/main/factories/adapters'

import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from 'aws-lambda/trigger/api-gateway-proxy'

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult | undefined> => {
  const middlewareManager =
    ApiGatewayMiddlewareManagerFactory.getInstance().make(
      AppRoutesFactory.getInstance().make()
    )
  return await middlewareManager.execute(event)
}
