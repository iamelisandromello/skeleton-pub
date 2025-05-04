import type { PublisherContract } from '@/application/contracts'
import type { ExampleQueueTreaty } from '@/application/services/tasks'

export class ExamplePubQueueTask implements ExampleQueueTreaty {
  constructor(private readonly pubInQueue: PublisherContract) {}

  async perform(
    payload: ExampleQueueTreaty.Params
  ): Promise<ExampleQueueTreaty.Result> {
    const typeQueue = 'process-publi-message'
    const wasPublished =
      await this.pubInQueue.publish<ExampleQueueTreaty.Params>({
        type: typeQueue,
        payload: {
          name: payload.name,
          email: payload.email,
          username: payload.username
        }
      })

    return wasPublished
  }
}
