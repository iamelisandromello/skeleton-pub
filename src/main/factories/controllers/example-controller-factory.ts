import { ExampleServiceFactory } from '@/main/factories/services'
import { ExampleValidationFactory } from '@/main/factories/validations'
import { ExampleController } from '@/presentation/controllers'
import type { Controller } from '@/presentation/controllers/controller-abstract'

export class ExampleControllerFactory {
  private static instance: ExampleControllerFactory
  private instanceExampleController: Controller | undefined

  public static getInstance(): ExampleControllerFactory {
    if (!ExampleControllerFactory.instance) {
      ExampleControllerFactory.instance = new ExampleControllerFactory()
    }

    return ExampleControllerFactory.instance
  }

  public make(): Controller {
    if (!this.instanceExampleController) {
      this.instanceExampleController = new ExampleController(
        ExampleValidationFactory.getInstance().make(),
        ExampleServiceFactory.getInstance().make()
      )
    }
    return this.instanceExampleController
  }
}
