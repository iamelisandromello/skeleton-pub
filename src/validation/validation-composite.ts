import type { Validation, InputType } from '@/presentation/interfaces'

export class ValidationComposite implements Validation<InputType> {
  constructor(private readonly validations: Validation<InputType>[]) {}

  async validate(input: InputType): Promise<Error | undefined> {
    for (const validation of this.validations) {
      const error = await validation.validate(input)
      if (error) {
        return error
      }
    }
  }
}

class NameValidation implements Validation<{ name: string }> {
  async validate(input: { name: string }): Promise<Error | undefined> {
    if (!input.name) {
      return new Error('Name is required')
    }
    return undefined
  }
}
