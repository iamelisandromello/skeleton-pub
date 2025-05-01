import {
  ServerError,
  TimeOutError,
  PublishError,
  MiddlewareError,
  UnavailableError,
  InvalidParamError,
  InvalidRouteError,
  MissingParamError,
  UnauthorizedError,
  NotFoundUserError,
  NotFoundRouteError,
  InvalidValueInEnumerableError
} from '@/main/errors'
import { ErrorsEnum } from '@/domain/enums'
import type { ErrorContainerContract } from '@/application/contracts/containers'
import { ErrorContainer } from '@/infra/containers/'

export class ErrorContainerFactory {
  private static instance: ErrorContainerFactory
  private instanceErrorContainer: ErrorContainer | undefined

  private constructor() {}

  public static getInstance(): ErrorContainerFactory {
    if (!ErrorContainerFactory.instance) {
      ErrorContainerFactory.instance = new ErrorContainerFactory()
    }
    return ErrorContainerFactory.instance
  }

  make(): ErrorContainerContract {
    const errorsMap = new Map<ErrorsEnum, Error>([
      [ErrorsEnum.SERVER_ERROR, new ServerError()],
      [ErrorsEnum.TIME_OUT_ERROR, new TimeOutError()],
      [ErrorsEnum.PUBLISH_ERROR, new PublishError()],
      [ErrorsEnum.MIDDLEWARE_ERROR, new MiddlewareError()],
      [ErrorsEnum.UNAVAILABLE_ERROR, new UnavailableError()],
      [ErrorsEnum.UNAUTHORIZED_ERROR, new UnauthorizedError()],
      [ErrorsEnum.INVALID_ROUTE_ERROR, new InvalidRouteError()],
      [ErrorsEnum.INVALID_PARAM_ERROR, new InvalidParamError('')],
      [ErrorsEnum.MISSING_PARAM_ERROR, new MissingParamError('')],
      [ErrorsEnum.NOT_FOUND_USER_ERROR, new NotFoundUserError('')],
      [ErrorsEnum.NOT_FOUND_ROUTE_ERROR, new NotFoundRouteError()],
      [
        ErrorsEnum.INVALID_VALUE_IN_ENUMERABLE_ERROR,
        new InvalidValueInEnumerableError()
      ]
    ])

    if (!this.instanceErrorContainer) {
      this.instanceErrorContainer = new ErrorContainer(errorsMap)
    }

    return this.instanceErrorContainer
  }
}
