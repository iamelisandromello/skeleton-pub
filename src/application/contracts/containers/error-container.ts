import { ErrorsEnum } from '@/domain/enums'

export interface ErrorContainerContract {
  make: (mistake: ErrorsEnum) => Error
}

export namespace ErrorContainerContract {
  export type ErrorsType = ErrorsEnum

  export const Errors = ErrorsEnum
}
