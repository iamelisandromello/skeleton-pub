import { EncapsulationError } from '@/application/encapsulation/errors'
import type { HttpResponse } from '@/presentation/helpers/http'

type typeError = {
  message: string
  statusCode: number
}

export function handleError(result: Error): HttpResponse {
  if (result instanceof EncapsulationError) {
    return {
      statusCode: result.getStatusCode().valueOf(),
      data: {
        message: result.getMessage(),
        data: result.getData()
      }
    }
  }

  const error = result as unknown as typeError
  return {
    statusCode: error.statusCode,
    data: {
      message: error.message
    }
  }
}
