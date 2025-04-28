import type { DatabaseConnection } from '@/infra/database/connections'

export interface SQLConnection extends DatabaseConnection {
  execute: <T = unknown>(
    query: string,
    values?: (string | number)[]
  ) => Promise<T>
  transaction: <T = unknown>(callback: () => T | Promise<T>) => Promise<T>
}

export namespace SQLConnection {
  export type Config = {
    host: string
    port: number
    user: string
    password: string
    database: string
    ssl?: string
    max?: number
  }
}
