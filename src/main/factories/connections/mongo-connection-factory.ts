import { TreatmentErrorAdapterFactory } from '@/main/factories/adapters'
import {
  MongoConnection,
  type NoSQLConnection
} from '@/infra/database/connections'

export class MongoConnectionFactory {
  private static instance: MongoConnectionFactory
  private instanceMongoConnection: MongoConnection | undefined

  public static getInstance(): MongoConnectionFactory {
    if (!MongoConnectionFactory.instance) {
      MongoConnectionFactory.instance = new MongoConnectionFactory()
    }

    return MongoConnectionFactory.instance
  }

  public make(url: string, config: NoSQLConnection.Config): MongoConnection {
    if (!this.instanceMongoConnection) {
      this.instanceMongoConnection = new MongoConnection(
        url,
        config,
        TreatmentErrorAdapterFactory.getInstance().make()
      )
    }
    return this.instanceMongoConnection
  }
}
