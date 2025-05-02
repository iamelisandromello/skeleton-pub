import type { ExampleQueueTreaty } from '@/application/services/tasks'
import type { TreatmentErrorContract } from '@/application/contracts'
import type { ExampleUsecase } from '@/domain/usecases'
import { ErrorsEnum } from '@/domain/enums'
import { mockUserRepository } from '@/domain/mocks'
import type { UserEntity } from '@/domain/entities'

export class ExampleService implements ExampleUsecase {
  constructor(
    private readonly pubService: ExampleQueueTreaty,
    private readonly treatment: TreatmentErrorContract
  ) {}

  async perform(params: ExampleUsecase.Params): Promise<ExampleUsecase.Result> {
    const { email } = params

    const isUser: UserEntity = await mockUserRepository.findByEmail(email)
    console.log('isUSER - ExampleService::: ', isUser)

    const wasPublished = await this.pubService.perform({
      name: isUser.name,
      email: isUser.email,
      username: isUser.username
    })

    if (!wasPublished) {
      return this.treatment.launchError({
        errorDescription: ErrorsEnum.PUBLISH_ERROR,
        messageDescription: `Error publishing to queue: ${wasPublished}`
      })
    }

    return wasPublished
  }
}
