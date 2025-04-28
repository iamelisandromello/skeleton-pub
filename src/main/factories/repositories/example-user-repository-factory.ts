import { DatabaseConnections } from '@/main/config/database-connections'
import { UserTransformerFactory } from '@/main/factories/transformers'
import { ExampleUserRepository } from '@/infra/database/repositories'

export class ExampleUserRepositoryFactory {
  private static instance: ExampleUserRepositoryFactory
  private instanceExampleUserRepository: ExampleUserRepository | undefined

  public static getInstance(): ExampleUserRepositoryFactory {
    if (!ExampleUserRepositoryFactory.instance) {
      ExampleUserRepositoryFactory.instance = new ExampleUserRepositoryFactory()
    }

    return ExampleUserRepositoryFactory.instance
  }

  public make(): ExampleUserRepository {
    if (!this.instanceExampleUserRepository) {
      this.instanceExampleUserRepository = new ExampleUserRepository(
        DatabaseConnections.catalyst,
        UserTransformerFactory.getInstance().make()
      )
    }
    return this.instanceExampleUserRepository
  }
}
