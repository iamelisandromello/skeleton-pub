import type { ErrorContainerContract } from '@/application/contracts/containers'
import { EncapsulationError } from '@/application/encapsulation'

export class ErrorContainer implements ErrorContainerContract {
  constructor(
    private readonly customErrors: Map<ErrorContainerContract.ErrorsType, Error>
  ) {}

  make(mistake: ErrorContainerContract.ErrorsType): Error {
    const customError = this.customErrors.get(mistake)
    const statusCode = 500
    if (!customError) {
      return new EncapsulationError(
        statusCode,
        'There was an internal error. Please, contact the support.'
      )
    }

    return customError
  }
}
