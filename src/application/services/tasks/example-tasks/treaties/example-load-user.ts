import type { UserEntity } from '@/domain/entities'

export interface ExampleLoadUserTreaty {
  perform: (
    email: ExampleLoadUserTreaty.Params
  ) => Promise<ExampleLoadUserTreaty.Result>
}

export namespace ExampleLoadUserTreaty {
  export type Params = { email: string }
  export type Result = UserEntity | false
}
