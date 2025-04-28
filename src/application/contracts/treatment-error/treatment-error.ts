import { ErrorsEnum } from '@/domain/enums'

export interface TreatmentErrorContract {
  launchError: (
    params: TreatmentErrorContract.Params
  ) => TreatmentErrorContract.Result
  setMessage: (error: Error, message: string) => TreatmentErrorContract.Result
}

export namespace TreatmentErrorContract {
  export type Params = {
    errorDescription: ErrorsEnum
    messageDescription?: string
  }

  export const enumErrors = ErrorsEnum

  export type Result = Error
}
