import type {
  SQLConnection,
  DatabaseConnection
} from '@/infra/database/connections'
import { ErrorsEnum } from '@/domain/enums'
import type { TreatmentErrorContract } from '@/application/contracts'
import type { RowDataPacket, ResultSetHeader } from 'mysql2/promise'
import mysql, { type Connection, type FieldPacket } from 'mysql2/promise'

export class MysqlConnection implements SQLConnection, DatabaseConnection {
  private connection?: Connection

  constructor(
    private readonly config: SQLConnection.Config,
    private readonly treatment: TreatmentErrorContract
  ) {}

  async open(): Promise<void> {
    try {
      this.connection = await mysql.createConnection(this.config)
    } catch (e) {
      console.error('[MYSQL CONNECTION ERROR]:', e)
      throw e
    }
  }

  async close(): Promise<void> {
    if (this.connection) {
      await this.connection.end()
    }
  }

  async execute<T = unknown>(
    query: string,
    values?: (string | number)[] | undefined
  ): Promise<T> {
    if (this.connection) {
      console.log('MYSQL STATEMENT:', query)
      console.log('MYSQL STATEMENT PARAMS:', JSON.stringify(values, null, 2))

      const [resultSet]: [RowDataPacket[], FieldPacket[]] =
        await this.connection.execute<RowDataPacket[]>(query, values)
      console.log('MYSQL RESULT:', JSON.stringify(resultSet, null, 2))
      return resultSet as unknown as T
    }

    throw this.treatment.launchError({
      errorDescription: ErrorsEnum.DATABASE_CONNECT_ERROR
    })
  }

  async transaction<T = unknown>(callback: () => T | Promise<T>): Promise<T> {
    if (!this.connection) {
      throw this.treatment.launchError({
        errorDescription: ErrorsEnum.DATABASE_CONNECT_ERROR
      })
    }

    try {
      await this.connection.beginTransaction()
      const result = await callback()
      await this.connection.commit()

      return result
    } catch (error: unknown) {
      await this.connection.rollback()
      throw this.treatment.launchError({
        errorDescription: ErrorsEnum.UNAVAILABLE_ERROR,
        messageDescription: (error as Error).message
      })
    }
  }
}
