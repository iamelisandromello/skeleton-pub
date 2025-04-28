import type { FindRepository } from '@/application/contracts/database'
import type { UserEntity } from '@/domain/entities'

export interface ExampleFindUserRepository
  extends FindRepository<
    ExampleFindUserRepository.Filters,
    ExampleFindUserRepository.Result
  > {}

export namespace ExampleFindUserRepository {
  export type Filters = {
    email: string
  }

  export type Entity = UserEntity

  export type Result = Entity | false
}
