import type { MiddlewareInterface } from '@/main/config/middlewares'
import { ErrorsEnum } from '@/domain/enums'
import type { TreatmentErrorContract } from '@/application/contracts'
import { routeError } from '@/presentation/helpers'

import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

export class CheckRoutesMiddleware
  implements MiddlewareInterface<APIGatewayProxyEvent, APIGatewayProxyResult>
{
  next!: MiddlewareInterface<APIGatewayProxyEvent, APIGatewayProxyResult>

  constructor(private readonly treatment: TreatmentErrorContract) {}

  async handle(request: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    if (!this.isValidRoute(request)) {
      return routeError(
        this.treatment.launchError({
          errorDescription: ErrorsEnum.NOT_FOUND_ROUTE_ERROR
        })
      )
    }
    if (!this.next) {
      throw this.treatment.launchError({
        errorDescription: ErrorsEnum.MIDDLEWARE_ERROR
      })
    }
    return this.next.handle(request)
  }

  isValidRoute(request: APIGatewayProxyEvent): boolean {
    return 'resource' in request && 'httpMethod' in request
  }
}
