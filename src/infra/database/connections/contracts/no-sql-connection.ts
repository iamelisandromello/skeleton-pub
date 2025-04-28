import type { DatabaseConnection } from '@/infra/database/connections'

type Document = {
  [key: string]: unknown
}

export interface NoSQLConnection extends DatabaseConnection {
  insertMany: (
    collection: string,
    docs: Document[],
    database?: string
  ) => Promise<{ registersInserted: number }>

  deleteMany: (
    collection: string,
    filter: Document,
    database?: string
  ) => Promise<{ registersDeleted: number }>

  find: <R>(
    collection: string,
    filter: NoSQLConnection.FindFilter<R>,
    database?: string,
    options?: NoSQLConnection.FindOptions
  ) => Promise<R[]>

  aggregate: <R>(
    collection: string,
    pipeline: Array<Record<string, unknown>>,
    database?: string
  ) => Promise<R[]>
}

export namespace NoSQLConnection {
  export type FindOptions = {
    limit?: number
    skip?: number
  }

  export type Config = {
    tls: boolean
    tlsCAFile: string
    retryWrites: boolean
  }

  export type FindFilter<T> = {
    [P in keyof T]?:
      | T[P]
      | { $in: Array<T[P]> }
      | { $eq: T[P] | boolean | string | number }
      | { $ne: T[P] }
      | { $lt: T[P] }
      | { $lte: T[P] }
      | { $gt: T[P] }
      | { $gte: T[P] }
      | { $or: Array<FindFilter<T>> }
      | { $and: Array<FindFilter<T>> }
      | { $not: FindFilter<T> }
      | { $nor: Array<FindFilter<T>> }
      | { $exists: boolean }
      | {
          $type:
            | 'double'
            | 'string'
            | 'objectId'
            | 'boolean'
            | 'date'
            | 'null'
            | 'regex'
        }
      | { $mod: [number, number] }
      | { $regex: string }
      | { $options: 'i' | 'm' | 'x' | 's' }
      | { $elemMatch: FindFilter<T> }
  }
}
