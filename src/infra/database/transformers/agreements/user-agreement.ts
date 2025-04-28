import type { UserEntity } from '@/domain/entities'

export interface UserAgreement {
  transform: (params: UserAgreement.DataEntity) => UserAgreement.Result
}

export namespace UserAgreement {
  export type DataEntity = {
    name: string
    email: string
    username: string
  }

  export type Result = UserEntity
}
