import { ErrorsEnum } from '@/domain/enums'
import type { NoSQLConnection } from '@/infra/database/connections'
import type { TreatmentErrorContract } from '@/application/contracts'

import { MongoClient, type MongoClientOptions, type Filter } from 'mongodb'

export class MongoConnection implements NoSQLConnection {
  private connection?: MongoClient
  constructor(
    private readonly url: string,
    private readonly config: NoSQLConnection.Config,
    private readonly treatment: TreatmentErrorContract
  ) {}

  async open(): Promise<void> {
    try {
      this.connection = await MongoClient.connect(
        this.url,
        this.config as MongoClientOptions
      )
    } catch (error) {
      console.error('[MONGO CONNECTION ERROR]:', error)
      throw error
    }
  }

  async close(): Promise<void> {
    if (this.connection) {
      await this.connection.close()
    }
  }

  async insertMany(
    collection: string,
    docs: Array<Record<string, unknown>>,
    database?: string
  ): Promise<{ registersInserted: number }> {
    if (!this.connection) {
      throw this.treatment.launchError({
        errorDescription: ErrorsEnum.DATABASE_CONNECT_ERROR
      })
    }
    try {
      const result = await this.connection
        .db(database)
        .collection(collection)
        .insertMany(docs)
      const registersInserted = result.insertedCount
      return { registersInserted }
    } catch (error) {
      console.error('[MONGO INSERT ERROR]:', error)
      throw error
    }
  }

  async deleteMany(
    collection: string,
    filter: Filter<Record<string, unknown>>,
    database?: string
  ): Promise<{ registersDeleted: number }> {
    if (!this.connection) {
      throw this.treatment.launchError({
        errorDescription: ErrorsEnum.DATABASE_CONNECT_ERROR
      })
    }
    try {
      const result = await this.connection
        .db(database)
        .collection(collection)
        .deleteMany(filter)
      const registersDeleted = result.deletedCount
      return { registersDeleted }
    } catch (error) {
      console.error('[MONGO DELETE ERROR]:', error)
      throw error
    }
  }

  async find<R>(
    collection: string,
    filter: NoSQLConnection.FindFilter<R>,
    database?: string,
    options?: NoSQLConnection.FindOptions
  ): Promise<R[]> {
    if (!this.connection) {
      throw this.treatment.launchError({
        errorDescription: ErrorsEnum.DATABASE_CONNECT_ERROR
      })
    }
    try {
      const result = await this.connection
        .db(database)
        .collection(collection)
        .find(filter, options)
        .toArray()
      return result as unknown as R[]
    } catch (error) {
      console.error('[MONGO FIND ERROR]:', error)
      throw error
    }
  }

  async aggregate<R>(
    collection: string,
    pipeline: Array<Record<string, unknown>>,
    database?: string
  ): Promise<R[]> {
    if (!this.connection) {
      throw this.treatment.launchError({
        errorDescription: ErrorsEnum.DATABASE_CONNECT_ERROR
      })
    }
    try {
      const result = await this.connection
        .db(database)
        .collection(collection)
        .aggregate(pipeline)
        .toArray()
      return result as unknown as R[]
    } catch (error) {
      console.error('[MONGO AGGREGATE ERROR]:', error)
      throw error
    }
  }
}
