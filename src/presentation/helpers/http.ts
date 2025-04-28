import { cors, type CorsConfig } from '@/main/config/cors'

class ServerError extends Error {
  constructor(error?: Error) {
    super('Server failed. Try again soon')
    this.name = 'ServerError'
    this.stack = error?.stack
  }
}

export type HttpRequest<Q = unknown, B = unknown, P = unknown> = {
  query: Q
  body: B
  path: P
}

export type HttpResponse<T = unknown> = {
  statusCode: number
  data: T
}

export type HttpLambdaResponse<T = unknown> = {
  statusCode: number
  body: T
  headers: CorsConfig
}

export const success = <T = unknown>(model: T): HttpResponse<T> => ({
  statusCode: 200,
  data: model
})

export const created = <T = unknown>(data: T): HttpResponse<T> => ({
  statusCode: 201,
  data
})

export const noContent = <T = unknown>(data: T): HttpResponse<T> => ({
  statusCode: 204,
  data
})

export const accepted = <T = unknown>(data: T): HttpResponse<T> => ({
  statusCode: 202,
  data
})

export const badRequest = (error: Error): HttpResponse<Error> => ({
  statusCode: 400,
  data: error
})

export const unathorized = (error: Error): HttpResponse<Error> => ({
  statusCode: 401,
  data: error
})

export const routeError = (error: unknown): HttpLambdaResponse<string> => ({
  statusCode: 404,
  body: JSON.stringify(error),
  headers: cors()
})

export const notFoundError = (error: unknown): HttpResponse<string> => ({
  statusCode: 404,
  data: JSON.stringify(error)
})

export const notAcceptable = (error: {
  message: string
  code?: number
}): HttpResponse<unknown> => ({
  statusCode: 406,
  data: {
    error: error.message,
    code: error.code
  }
})

export const serverError = (error: unknown): HttpResponse<Error> => ({
  statusCode: 500,
  data: new ServerError(error instanceof Error ? error : undefined)
})

export const environmentError = (
  envError: unknown
): HttpLambdaResponse<string> => {
  return specificError500(envError)
}

export const databaseError = (dbError: unknown): HttpLambdaResponse<string> => {
  return specificError500(dbError)
}

export const unavailabilityError = (
  outError: unknown
): HttpLambdaResponse<string> => {
  return specificError500(outError)
}

const specificError500 = (error: unknown): HttpLambdaResponse<string> => ({
  statusCode: 500,
  body: JSON.stringify(error),
  headers: cors()
})

export const badGateway = (error: Error): HttpResponse<Error> => ({
  statusCode: 502,
  data: error
})

export const unavailable = (error: Error): HttpResponse<Error> => ({
  statusCode: 503,
  data: error
})
