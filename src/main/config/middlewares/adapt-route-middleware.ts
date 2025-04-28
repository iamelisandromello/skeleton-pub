import type { RouteAdapter } from '@/main/adapters'
import type { MiddlewareInterface } from '@/main/config/middlewares'
import { ErrorsEnum } from '@/domain/enums'
import type { TreatmentErrorContract } from '@/application/contracts'
import { routeError } from '@/presentation/helpers'

import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

type Method = 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH'
export class AdaptRouteMiddleware
  implements MiddlewareInterface<APIGatewayProxyEvent, APIGatewayProxyResult>
{
  next!: MiddlewareInterface<APIGatewayProxyEvent, APIGatewayProxyResult>

  constructor(
    private readonly treatment: TreatmentErrorContract,
    private readonly routeAdapter: RouteAdapter
  ) {}

  async handle(request: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const routeConfig = {
      route: request.resource,
      method: request.httpMethod as Method,
      event: request
    }

    const data = await this.routeAdapter.adaptRoute(routeConfig)

    if (!data) {
      return routeError(
        this.treatment.launchError({
          errorDescription: ErrorsEnum.NOT_FOUND_ROUTE_ERROR
        })
      )
    }
    return data
  }
}
