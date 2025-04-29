export interface ExampleUsecase {
  perform: (params: ExampleUsecase.Params) => Promise<ExampleUsecase.Result>
}

export namespace ExampleUsecase {
  export type Params = {
    email: string
    accessToken: string
  }

  export type SuccessResult = true

  export type Result = SuccessResult | Error
}
