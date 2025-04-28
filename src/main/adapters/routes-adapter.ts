import { AdapterLambda } from '@/main/adapters'
import type { Controller } from '@/presentation/controllers/controller-abstract'
import type { Routes, RouteConfig } from '@/main/config/abstract-routes'

import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from 'aws-lambda/trigger/api-gateway-proxy'

type Route = { event: APIGatewayProxyEvent; route: string; method: Method }
type Method = 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH'
type GuardRoute = { route: string; method: string }

export class RouteAdapter {
  private readonly routes: Routes

  constructor(routes: Routes) {
    this.routes = routes
  }

  async adaptRoute(params: Route): Promise<APIGatewayProxyResult | false> {
    const { event, ...rest } = params
    const controller = this.defineRoute(rest)
    if (controller) {
      const adapter = new AdapterLambda(controller)
      return adapter.handler(event)
    }
    return false
  }

  private defineRoute(params: GuardRoute): Controller | false {
    const { route, method } = params

    const loadRoutes = this.routes.getRoutes()
    const findRoute = loadRoutes.find(
      (set: RouteConfig) =>
        set.route.path === route && set.route.method === method
    )
    return findRoute?.controller ?? false
  }
}
