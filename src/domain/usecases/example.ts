import type { UserEntity } from '@/domain/entities'

export interface ExampleUsecase {
  perform: (params: ExampleUsecase.Params) => Promise<ExampleUsecase.Result>
}

export namespace ExampleUsecase {
  export type Params = {
    email: string
    accessToken: string
  }

  export type SuccessResult = {
    data: UserEntity
  }

  export type Result = SuccessResult | Error
}
