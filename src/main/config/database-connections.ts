import { variables } from '@/main/config/variables'
import {
  MongoConnectionFactory,
  MysqlConnectionFactory
} from '@/main/factories/connections'
import type {
  SQLConnection,
  NoSQLConnection,
  DatabaseConnection
} from '@/infra/database/connections'

export const DatabaseConnections: DatabaseConnectionsType<DatabaseConnection> =
  {
    catalyst: MysqlConnectionFactory.getInstance().make({
      host: variables.dbMySql.host,
      port: Number(variables.dbMySql.port),
      user: variables.dbMySql.user,
      password: variables.dbMySql.pass,
      database: variables.dbMySql.name
    }),
    mongo: MongoConnectionFactory.getInstance().make(
      `mongodb://${variables.dbMongo.user}:${encodeURIComponent(variables.dbMongo.pass)}@${variables.dbMongo.url}:${variables.dbMongo.port}`,
      {
        tls: variables.dbMongo.ssl === 'true',
        tlsCAFile: variables.dbMongo.ssl === 'true' ? 'global-bundle.pem' : '',
        retryWrites: false
      }
    )
  }

type DatabaseConnectionsType<T> = {
  catalyst: T & SQLConnection
  mongo: T & NoSQLConnection
}
