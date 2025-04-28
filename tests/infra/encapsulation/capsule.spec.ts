import { capsuleException, capsuleHttpResponse } from '@/infra/encapsulation'
import type { HttpExceptionResponse } from '@/infra/encapsulation'

describe('capsuleException', () => {
  it('deve encapsular um erro e status code corretamente', () => {
    const error = new Error('Erro interno')
    const result = capsuleException(500, error)

    expect(result).toEqual<HttpExceptionResponse<Error>>({
      statusCode: 500,
      data: error
    })
  })
})

describe('capsuleHttpResponse', () => {
  it('deve encapsular dados quando for um objeto', () => {
    const data = { name: 'teste' }
    const result = capsuleHttpResponse<typeof data>(200, data)

    expect(result).toEqual<HttpExceptionResponse<typeof data>>({
      statusCode: 200,
      data
    })
  })

  it('deve lançar erro se o data não for um objeto', () => {
    expect(() => capsuleHttpResponse(200, 'string inválida')).toThrow(
      'Data is not of type T'
    )
    expect(() => capsuleHttpResponse(200, null)).toThrow(
      'Data is not of type T'
    )
  })
})
