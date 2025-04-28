export type HttpExceptionResponse<T = unknown> = {
  statusCode: number
  data: T
}

export const capsuleException = (
  statusCode: number,
  error: Error
): HttpExceptionResponse<Error> => ({
  statusCode: statusCode,
  data: error
})

export const capsuleHttpResponse = <T>(
  statusCode: number,
  data: unknown
): HttpExceptionResponse<T> => {
  if (typeof data === 'object' && data !== null) {
    return {
      statusCode: statusCode,
      data: data as T
    }
  }
  throw new Error('Data is not of type T')
}
