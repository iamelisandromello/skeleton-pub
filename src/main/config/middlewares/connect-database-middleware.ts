import type { MiddlewareInterface } from '@/main/config/middlewares'
import { DatabaseConnections } from '@/main/config/database-connections'
import { ErrorsEnum } from '@/domain/enums'
import type { TreatmentErrorContract } from '@/application/contracts'
import type { DatabaseConnection } from '@/infra/database/connections'

export class ConnectDatabaseMiddleware<T, R>
  implements MiddlewareInterface<T, R>
{
  private readonly connections: DatabaseConnection[]
  public next!: MiddlewareInterface<T, R>

  constructor(private readonly treatment: TreatmentErrorContract) {
    this.connections = Object.values(DatabaseConnections)
  }

  async handle(request: T): Promise<R> {
    if (!this.next) {
      throw this.treatment.launchError({
        errorDescription: ErrorsEnum.MIDDLEWARE_ERROR
      })
    }
    try {
      await Promise.all(
        this.connections.map(async (connection) => connection.open())
      )

      return await this.next.handle(request)
    } finally {
      await Promise.all(
        this.connections.map(async (connection) => connection.close())
      )
    }
  }
}
