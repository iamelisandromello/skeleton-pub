import type { UserEntity } from '@/domain/entities'

export interface ExampleQueueTreaty {
  perform: (
    Payload: ExampleQueueTreaty.Params
  ) => Promise<ExampleQueueTreaty.Result>
}

export namespace ExampleQueueTreaty {
  export type Params = UserEntity
  export type Result = boolean | Error
}
