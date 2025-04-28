import { HttpStatusCodeEnum } from '@/domain/enums'

export class EncapsulationError extends Error {
  private readonly statusCode: number
  private readonly data?: Record<string, unknown>
  constructor(
    statusCode: HttpStatusCodeEnum,
    message?: string,
    data?: Record<string, unknown>
  ) {
    super(message ?? HttpStatusCodeEnum[statusCode.valueOf()])
    this.statusCode = statusCode
    this.data = data
  }

  getMessage(): string {
    return this.message
  }

  getStatusCode(): HttpStatusCodeEnum {
    return this.statusCode
  }

  getData(): Record<string, unknown> | undefined {
    return this.data
  }
}
