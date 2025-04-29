import { variables } from '@/main/config/variables'
import { SQSPublisherFactory } from '@/main/factories/message-broker'
import { ExamplePubQueueTask } from '@/application/services'

export class ExamplePubQueueTaskFactory {
  private static instance: ExamplePubQueueTaskFactory
  private instanceExamplePubQueueTask: ExamplePubQueueTask | undefined

  public static getInstance(): ExamplePubQueueTaskFactory {
    if (!ExamplePubQueueTaskFactory.instance) {
      ExamplePubQueueTaskFactory.instance = new ExamplePubQueueTaskFactory()
    }

    return ExamplePubQueueTaskFactory.instance
  }

  public make(): ExamplePubQueueTask {
    if (!this.instanceExamplePubQueueTask) {
      this.instanceExamplePubQueueTask = new ExamplePubQueueTask(
        SQSPublisherFactory.getInstance().make(variables.queueSQS)
      )
    }
    return this.instanceExamplePubQueueTask
  }
}
