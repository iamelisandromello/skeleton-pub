import { TreatmentErrorAdapterFactory } from '@/main/factories/adapters'
import {
  PostgresqlConnection,
  type SQLConnection
} from '@/infra/database/connections'

export class PostgresqlConnectionFactory {
  private static instance: PostgresqlConnectionFactory
  private instancePostgresqlConnection: PostgresqlConnection | undefined

  public static getInstance(): PostgresqlConnectionFactory {
    if (!PostgresqlConnectionFactory.instance) {
      PostgresqlConnectionFactory.instance = new PostgresqlConnectionFactory()
    }

    return PostgresqlConnectionFactory.instance
  }

  public make(config: SQLConnection.Config): PostgresqlConnection {
    if (!this.instancePostgresqlConnection) {
      this.instancePostgresqlConnection = new PostgresqlConnection(
        config,
        TreatmentErrorAdapterFactory.getInstance().make()
      )
    }
    return this.instancePostgresqlConnection
  }
}
