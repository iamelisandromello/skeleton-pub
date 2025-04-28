import { ErrorContainer } from '@/infra/containers'
import { EncapsulationError } from '@/application/encapsulation'
import type { ErrorContainerContract } from '@/application/contracts/containers'

describe('ErrorContainer', () => {
  const CUSTOM_ERROR_KEY = 'USER_NOT_FOUND' as ErrorContainerContract.ErrorsType
  const NON_EXISTENT_KEY = 'UNKNOWN_ERROR' as ErrorContainerContract.ErrorsType

  const customError = new Error('Usuário não encontrado')
  let errorContainer: ErrorContainer

  beforeEach(() => {
    const customErrors = new Map<ErrorContainerContract.ErrorsType, Error>()
    customErrors.set(CUSTOM_ERROR_KEY, customError)

    errorContainer = new ErrorContainer(customErrors)
  })

  it('deve retornar o erro customizado se a chave existir no container', () => {
    const result = errorContainer.make(CUSTOM_ERROR_KEY)
    expect(result).toBe(customError)
  })

  it('deve retornar um EncapsulationError com status 500 se a chave não existir', () => {
    const result = errorContainer.make(NON_EXISTENT_KEY)

    expect(result).toBeInstanceOf(EncapsulationError)
    expect((result as EncapsulationError).getStatusCode()).toBe(500)
    expect(result.message).toBe(
      'There was an internal error. Please, contact the support.'
    )
  })
})
