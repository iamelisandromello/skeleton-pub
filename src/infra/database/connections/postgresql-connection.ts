import type {
  DatabaseConnection,
  SQLConnection
} from '@/infra/database/connections'
import { ErrorsEnum } from '@/domain/enums'
import type { TreatmentErrorContract } from '@/application/contracts'

import crypto from 'node:crypto'
import pgPromise, { PreparedStatement, type IBaseProtocol } from 'pg-promise'

type Config = Omit<SQLConnection.Config, 'ssl'>

export class PostgresqlConnection implements SQLConnection, DatabaseConnection {
  private readonly pgp: pgPromise.IMain
  private con?: IBaseProtocol<unknown>

  constructor(
    private readonly config: Config,
    private readonly treatment: TreatmentErrorContract
  ) {
    this.pgp = pgPromise({ capSQL: true })
  }

  async open(): Promise<void> {
    this.con = this.pgp({
      ...this.config,
      max: 10
    })
  }

  async close(): Promise<void> {
    if (this.con) {
      this.pgp?.end()
    }
  }

  async execute<T>(query: string, values: unknown[] = []): Promise<T> {
    console.log('[PGSQL QUERY]:', this.pgp.as.format(query, values))
    const preparedStatement = new PreparedStatement({
      name: crypto.randomUUID(),
      text: query,
      values: values
    })

    if (!this.con) {
      throw this.treatment.launchError({
        errorDescription: ErrorsEnum.DATABASE_CONNECT_ERROR
      })
    }

    return await this.con.query<T>(preparedStatement)
  }

  async transaction<T = unknown>(callback: () => T | Promise<T>): Promise<T> {
    if (!this.con) {
      throw this.treatment.launchError({
        errorDescription: ErrorsEnum.DATABASE_CONNECT_ERROR
      })
    }

    return await this.con.tx(callback)
  }
}
