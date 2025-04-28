import { ExampleUserRepositoryFactory } from '@/main/factories/repositories'
import { ExampleLoadUserTask } from '@/application/services'
import { TreatmentErrorAdapterFactory } from '@/main/factories/adapters'

export class ExampleLoadUserTaskFactory {
  private static instance: ExampleLoadUserTaskFactory
  private instanceExampleLoadUserTask: ExampleLoadUserTask | undefined

  public static getInstance(): ExampleLoadUserTaskFactory {
    if (!ExampleLoadUserTaskFactory.instance) {
      ExampleLoadUserTaskFactory.instance = new ExampleLoadUserTaskFactory()
    }

    return ExampleLoadUserTaskFactory.instance
  }

  public make(): ExampleLoadUserTask {
    if (!this.instanceExampleLoadUserTask) {
      this.instanceExampleLoadUserTask = new ExampleLoadUserTask(
        ExampleUserRepositoryFactory.getInstance().make(),
        TreatmentErrorAdapterFactory.getInstance().make()
      )
    }
    return this.instanceExampleLoadUserTask
  }
}
