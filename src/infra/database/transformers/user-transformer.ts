import type { UserAgreement } from '@/infra/database/transformers'

export class UserTransformer implements UserAgreement {
  transform(params: UserAgreement.DataEntity): UserAgreement.Result {
    return {
      name: params.name,
      email: params.email,
      username: params.username
    }
  }
}
