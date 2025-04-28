import {
  makeFakeEnum,
  makeFakeError,
  makeErrorContainer
} from '@/tests/helpers'
import type { ErrorContainerContract } from '@/application/contracts'
import { EnumAdapter } from '@/main/adapters'

describe('EnumAdapter', () => {
  const mockError = makeFakeError('Custom error')

  let errorContainer: ErrorContainerContract
  let sut: EnumAdapter

  beforeEach(() => {
    errorContainer = makeErrorContainer('Custom error')
    sut = new EnumAdapter(errorContainer)
  })

  describe('fromValue', () => {
    it('deve retornar o valor correto com um valor válido', () => {
      const result = sut.fromValue<typeof makeFakeEnum>(makeFakeEnum, 'success')
      expect(result).toBe('success')
    })

    it('deve lançar erro com valor inexistente', () => {
      expect(() =>
        sut.fromValue<typeof makeFakeEnum>(makeFakeEnum, 'not_found')
      ).toThrow(mockError)
    })
  })

  describe('fromLabel', () => {
    it('deve retornar o valor correto com label válido', () => {
      const result = sut.fromLabel<typeof makeFakeEnum>(makeFakeEnum, 'ERROR')
      expect(result).toBe('error')
    })

    it('deve lançar erro com label inexistente', () => {
      expect(() =>
        sut.fromLabel<typeof makeFakeEnum>(makeFakeEnum, 'INVALID')
      ).toThrow(mockError)
    })
  })

  describe('getLabel', () => {
    it('deve retornar o label correspondente ao valor', () => {
      const result = sut.getLabel(makeFakeEnum, 'error')
      expect(result).toBe('ERROR')
    })

    it('deve lançar erro se o valor não for string ou number', () => {
      expect(() => sut.getLabel(makeFakeEnum, { invalid: true })).toThrow(
        mockError
      )
    })
  })

  describe('getLabels', () => {
    it('deve retornar apenas os valores que são strings', () => {
      const result = sut.getLabels(makeFakeEnum)
      expect(result).toEqual(['success', 'error'])
    })
  })

  describe('initializeCustomError', () => {
    it('deve chamar errorContainer.make com o erro correto', () => {
      const makeSpy = jest.spyOn(errorContainer, 'make')
      new EnumAdapter(errorContainer) // força chamada do initializeCustomError
      expect(makeSpy).toHaveBeenCalledWith(
        expect.stringMatching(/invalidValueInEnumerableError/)
      )
    })
  })
})
