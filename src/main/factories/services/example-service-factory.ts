import { ExamplePubQueueTaskFactory } from '@/main/factories/services/tasks'
import { TreatmentErrorAdapterFactory } from '@/main/factories/adapters'
import { ExampleService } from '@/application/services'

export class ExampleServiceFactory {
  private static instance: ExampleServiceFactory
  private exampleServiceInstance: ExampleService | undefined

  private constructor() {}

  public static getInstance(): ExampleServiceFactory {
    if (!ExampleServiceFactory.instance) {
      ExampleServiceFactory.instance = new ExampleServiceFactory()
    }

    return ExampleServiceFactory.instance
  }

  public make(): ExampleService {
    if (!this.exampleServiceInstance) {
      this.exampleServiceInstance = new ExampleService(
        ExamplePubQueueTaskFactory.getInstance().make(),
        TreatmentErrorAdapterFactory.getInstance().make()
      )
    }
    return this.exampleServiceInstance
  }
}
