import type { ExamplePubQueueTask } from '@/application/services/tasks'
import type { TreatmentErrorContract } from '@/application/contracts'
import type { ExampleUsecase } from '@/domain/usecases'
import { ErrorsEnum } from '@/domain/enums'

export class ExampleService implements ExampleUsecase {
  constructor(
    private readonly pubService: ExamplePubQueueTask,
    private readonly treatment: TreatmentErrorContract
  ) {}

  async perform(params: ExampleUsecase.Params): Promise<ExampleUsecase.Result> {
    const { email } = params

    const isUser = {
      email: email,
      username: 'iamelisandromello'
    }
    console.log('isUSER - ExampleService::: ', isUser)

    const wasPublished = await this.pubService.perform({
      email: isUser.email,
      username: isUser.username
    })

    if (!wasPublished) {
      return this.treatment.launchError({
        errorDescription: ErrorsEnum.NOT_FOUND_USER_ERROR,
        messageDescription: `User not found: ${email}`
      })
    }

    return wasPublished
  }
}
