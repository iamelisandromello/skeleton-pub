import { UserTransformer } from '@/infra/database/transformers'

export class UserTransformerFactory {
  private static instance: UserTransformerFactory
  private instanceUserTransformer: UserTransformer | undefined

  public static getInstance(): UserTransformerFactory {
    if (!UserTransformerFactory.instance) {
      UserTransformerFactory.instance = new UserTransformerFactory()
    }

    return UserTransformerFactory.instance
  }

  public make(): UserTransformer {
    if (!this.instanceUserTransformer) {
      this.instanceUserTransformer = new UserTransformer()
    }
    return this.instanceUserTransformer
  }
}
