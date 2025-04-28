import { TreatmentErrorAdapterFactory } from '@/main/factories/adapters'
import {
  MysqlConnection,
  type SQLConnection
} from '@/infra/database/connections'

export class MysqlConnectionFactory {
  private static instance: MysqlConnectionFactory
  private instanceMySqlConnection: MysqlConnection | undefined

  public static getInstance(): MysqlConnectionFactory {
    if (!MysqlConnectionFactory.instance) {
      MysqlConnectionFactory.instance = new MysqlConnectionFactory()
    }

    return MysqlConnectionFactory.instance
  }

  public make(config: SQLConnection.Config): MysqlConnection {
    if (!this.instanceMySqlConnection) {
      this.instanceMySqlConnection = new MysqlConnection(
        config,
        TreatmentErrorAdapterFactory.getInstance().make()
      )
    }
    return this.instanceMySqlConnection
  }
}
