import { ErrorsEnum } from '@/domain/enums'
import type {
  EnumContract,
  ErrorContainerContract
} from '@/application/contracts'
import type { TreatmentErrorContract } from '@/application/contracts/treatment-error'

export class TreatmentErrorAdapter implements TreatmentErrorContract {
  constructor(
    private readonly enumAdapter: EnumContract,
    private readonly errorContainer: ErrorContainerContract
  ) {}

  launchError(
    params: TreatmentErrorContract.Params
  ): TreatmentErrorContract.Result {
    const { errorDescription, messageDescription } = params

    const isError = this.errorContainer.make(
      this.enumAdapter.fromValue<ErrorsEnum>(ErrorsEnum, errorDescription)
    )
    if (messageDescription) return this.setMessage(isError, messageDescription)
    return isError
  }

  setMessage(error: Error, message: string): Error {
    error.message = message
    return error
  }
}
