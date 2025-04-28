import { EncapsulationError } from '@/application/encapsulation/errors'
import { HttpStatusCodeEnum } from '@/domain/enums'

describe('EncapsulationError', () => {
  describe('constructor', () => {
    it('deve criar uma instância com status code e mensagem padrão', () => {
      const error = new EncapsulationError(HttpStatusCodeEnum.BAD_REQUEST)

      expect(error).toBeInstanceOf(EncapsulationError)
      expect(error.getMessage()).toBe(
        HttpStatusCodeEnum[HttpStatusCodeEnum.BAD_REQUEST]
      )
      expect(error.getStatusCode()).toBe(HttpStatusCodeEnum.BAD_REQUEST)
      expect(error.getData()).toBeUndefined()
    })

    it('deve criar uma instância com status code e mensagem personalizada', () => {
      const customMessage = 'Erro personalizado'
      const error = new EncapsulationError(
        HttpStatusCodeEnum.BAD_REQUEST,
        customMessage
      )

      expect(error.getMessage()).toBe(customMessage)
      expect(error.getStatusCode()).toBe(HttpStatusCodeEnum.BAD_REQUEST)
    })

    it('deve criar uma instância com dados adicionais', () => {
      const data = { field: 'value', count: 1 }
      const error = new EncapsulationError(
        HttpStatusCodeEnum.BAD_REQUEST,
        'Erro com dados',
        data
      )

      expect(error.getData()).toEqual(data)
    })
  })

  describe('getters', () => {
    it('deve retornar a mensagem correta', () => {
      const message = 'Mensagem de teste'
      const error = new EncapsulationError(
        HttpStatusCodeEnum.BAD_REQUEST,
        message
      )

      expect(error.getMessage()).toBe(message)
    })

    it('deve retornar o status code correto', () => {
      const error = new EncapsulationError(HttpStatusCodeEnum.NOT_FOUND)

      expect(error.getStatusCode()).toBe(HttpStatusCodeEnum.NOT_FOUND)
    })

    it('deve retornar os dados corretos', () => {
      const data = { error: 'test' }
      const error = new EncapsulationError(
        HttpStatusCodeEnum.BAD_REQUEST,
        'Erro',
        data
      )

      expect(error.getData()).toEqual(data)
    })
  })

  describe('herança', () => {
    it('deve ser uma instância de Error', () => {
      const error = new EncapsulationError(HttpStatusCodeEnum.BAD_REQUEST)

      expect(error).toBeInstanceOf(Error)
    })
  })
})
