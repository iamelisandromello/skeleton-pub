import type { HttpMethodEnum, HttpStatusCodeEnum } from '@/domain/enums'

export type HttpRequest = {
  url: string
  method: HttpMethodEnum
  body?: Record<string, unknown>
  headers?: Record<string, string>
}

export interface HttpContract {
  request: <R = unknown>(data: HttpRequest) => Promise<HttpResponse<R>>
}

export type HttpResponse<T = unknown> = {
  statusCode: HttpStatusCodeEnum
  body?: T
}
