import { ErrorsEnum } from '@/domain/enums'
import type { TreatmentErrorContract } from '@/application/contracts'
import type { Validation, InputType } from '@/presentation/interfaces'

export class RequireFieldValidation implements Validation<InputType> {
  constructor(
    private readonly fieldName: string,
    private readonly treatment: TreatmentErrorContract
  ) {}

  async validate(input: InputType): Promise<Error | undefined> {
    if (!input[this.fieldName]) {
      return this.treatment.launchError({
        errorDescription: ErrorsEnum.MISSING_PARAM_ERROR,
        messageDescription: `Mandatory parameter not found:: ${String(this.fieldName)}`
      })
    }
  }
}
