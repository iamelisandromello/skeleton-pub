import type { SQLConnection } from '@/infra/database/connections'
import type { UserAgreement } from '@/infra/database/transformers'
import type { ExampleFindUserRepository } from '@/application/contracts/database'

export class ExampleUserRepository implements ExampleFindUserRepository {
  constructor(
    private readonly dbCatalystConnection: SQLConnection,
    private readonly userTransformer: UserAgreement
  ) {}

  async find(
    filters?: ExampleFindUserRepository.Filters
  ): Promise<ExampleFindUserRepository.Result> {
    const query = `
    SELECT name,
           email,
           username
    FROM Users
    WHERE email = IFNULL(?, email);
    `
    const result = await this.dbCatalystConnection.execute<
      UserAgreement.DataEntity[]
    >(query, [filters?.email ?? ''])

    if (result.length <= 0) return false

    return this.userTransformer.transform(result[0])
  }
}
