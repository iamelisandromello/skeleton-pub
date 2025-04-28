import { ErrorsEnum } from '@/domain/enums'
import type {
  EnumContract,
  ErrorContainerContract
} from '@/application/contracts'

export class EnumAdapter implements EnumContract {
  private customError: Error
  private readonly DEFAULT_ERROR_MESSAGE =
    'There was an internal error. Please, contact the support.'

  constructor(private readonly errorContainer: ErrorContainerContract) {
    this.customError = this.initializeCustomError()
  }

  fromValue<T>(
    enumerable: EnumContract.Type,
    value: EnumContract.Type[keyof EnumContract.Type]
  ): T {
    const label = Object.keys(enumerable).find(
      (key) => enumerable[key] === value
    )
    if (label === undefined) {
      throw this.customError
    }

    return this.fromLabel(enumerable, label)
  }

  fromLabel<T>(enumerable: EnumContract.Type, label: string): T {
    const instance = enumerable[label] as T

    if (instance === undefined) {
      throw this.customError
    }

    return instance
  }

  getLabel(enumerable: EnumContract.Type, enumerableInstance: unknown): string {
    if (
      typeof enumerableInstance === 'string' ||
      typeof enumerableInstance === 'number'
    ) {
      return Object.keys(enumerable).find(
        (key) => enumerable[key] === enumerableInstance
      ) as string
    }
    throw this.customError
  }

  getLabels(enumerable: EnumContract.Type): string[] {
    return Object.values(enumerable)
      .filter((value): value is string => typeof value === 'string')
      .map(String)
  }

  private initializeCustomError(): Error {
    return (
      this.errorContainer.make(
        this.fromValue(ErrorsEnum, 'invalidValueInEnumerableError')
      ) ?? new Error(this.DEFAULT_ERROR_MESSAGE)
    )
  }
}
