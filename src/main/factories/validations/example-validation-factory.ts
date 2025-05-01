import type { Validation, InputType } from '@/presentation/interfaces'
import { RequireFieldValidation } from '@/validation/validators'
import { ValidationComposite } from '@/validation/validation-composite'
import { TreatmentErrorAdapterFactory } from '@/main/factories/adapters'

export class ExampleValidationFactory {
  private static instance: ExampleValidationFactory
  private instanceValidationComposite: ValidationComposite | undefined

  public static getInstance(): ExampleValidationFactory {
    if (!ExampleValidationFactory.instance) {
      ExampleValidationFactory.instance = new ExampleValidationFactory()
    }

    return ExampleValidationFactory.instance
  }

  public make(): ValidationComposite {
    const validations: Validation<InputType>[] = []
    for (const field of ['email']) {
      validations.push(
        new RequireFieldValidation(
          field,
          TreatmentErrorAdapterFactory.getInstance().make()
        )
      )
    }

    if (!this.instanceValidationComposite) {
      this.instanceValidationComposite = new ValidationComposite(validations)
    }
    return this.instanceValidationComposite
  }
}
