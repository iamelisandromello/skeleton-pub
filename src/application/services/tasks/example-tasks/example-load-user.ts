import type { TreatmentErrorContract } from '@/application/contracts'
import type { ExampleFindUserRepository } from '@/application/contracts/database'
import type { ExampleLoadUserTreaty } from '@/application/services/tasks'

export class ExampleLoadUserTask implements ExampleLoadUserTreaty {
  constructor(
    private readonly exampleRepository: ExampleFindUserRepository,
    private readonly treatment: TreatmentErrorContract
  ) {}

  async perform(
    params: ExampleLoadUserTreaty.Params
  ): Promise<ExampleLoadUserTreaty.Result> {
    const isUser = await this.exampleRepository.find(params)

    return isUser
  }
}
