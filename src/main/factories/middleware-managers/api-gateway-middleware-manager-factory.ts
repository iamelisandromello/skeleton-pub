import {
  MiddlewareManager,
  AdaptRouteMiddleware,
  CheckRoutesMiddleware,
  type MiddlewareManagerInterface,
  ApiGatewayMiddlewareErrorHandler
} from '@/main/config/middlewares'
import {
  TreatmentErrorAdapterFactory,
  RouteAdapterFactory
} from '@/main/factories/adapters'
import type { Routes } from '@/main/config/abstract-routes'

import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

export class ApiGatewayMiddlewareManagerFactory {
  private static instance: ApiGatewayMiddlewareManagerFactory
  private instanceApiGatewayMiddleware:
    | MiddlewareManagerInterface<APIGatewayProxyEvent, APIGatewayProxyResult>
    | undefined

  public static getInstance(): ApiGatewayMiddlewareManagerFactory {
    if (!ApiGatewayMiddlewareManagerFactory.instance) {
      ApiGatewayMiddlewareManagerFactory.instance =
        new ApiGatewayMiddlewareManagerFactory()
    }

    return ApiGatewayMiddlewareManagerFactory.instance
  }

  public make(
    routes: Routes
  ): MiddlewareManagerInterface<APIGatewayProxyEvent, APIGatewayProxyResult> {
    if (!this.instanceApiGatewayMiddleware) {
      this.instanceApiGatewayMiddleware = new MiddlewareManager<
        APIGatewayProxyEvent,
        APIGatewayProxyResult
      >(new ApiGatewayMiddlewareErrorHandler())
    }

    this.instanceApiGatewayMiddleware.use([
      new CheckRoutesMiddleware(
        TreatmentErrorAdapterFactory.getInstance().make()
      ),
      new AdaptRouteMiddleware(
        TreatmentErrorAdapterFactory.getInstance().make(),
        RouteAdapterFactory.getInstance().make(routes)
      )
    ])

    return this.instanceApiGatewayMiddleware
  }
}
