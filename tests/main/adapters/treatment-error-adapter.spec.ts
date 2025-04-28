import { makeErrorContainer, makeEnumAdapter } from '@/tests/helpers'
import { TreatmentErrorAdapter } from '@/main/adapters'
import { ErrorsEnum } from '@/domain/enums'

describe('TreatmentErrorAdapter', () => {
  const makeSut = () => {
    const enumAdapter = makeEnumAdapter()
    const errorContainer = makeErrorContainer('Default error message')
    const sut = new TreatmentErrorAdapter(enumAdapter, errorContainer)
    return { sut, enumAdapter, errorContainer }
  }

  it('deve lançar erro com descrição padrão', () => {
    const { sut, enumAdapter, errorContainer } = makeSut()

    const result = sut.launchError({
      errorDescription: ErrorsEnum.UNAUTHORIZED_ERROR
    })

    expect(enumAdapter.fromValue).toHaveBeenCalledWith(
      ErrorsEnum,
      ErrorsEnum.UNAUTHORIZED_ERROR
    )
    expect(errorContainer.make).toHaveBeenCalledWith(
      ErrorsEnum.UNAUTHORIZED_ERROR
    )
    expect(result).toBeInstanceOf(Error)
    expect(result.message).toBe('Default error message')
  })

  it('deve lançar erro e sobrescrever a mensagem se messageDescription for fornecido', () => {
    const { sut, errorContainer } = makeSut()

    const result = sut.launchError({
      errorDescription: ErrorsEnum.UNAUTHORIZED_ERROR,
      messageDescription: 'Token inválido ou expirado'
    })

    expect(errorContainer.make).toHaveBeenCalled()
    expect(result).toBeInstanceOf(Error)
    expect(result.message).toBe('Token inválido ou expirado')
  })

  it('setMessage deve sobrescrever a mensagem do erro corretamente', () => {
    const { sut } = makeSut()

    const error = new Error('Mensagem antiga')
    const newMessage = 'Nova mensagem'

    const result = sut.setMessage(error, newMessage)

    expect(result.message).toBe(newMessage)
    expect(result).toBe(error)
  })
})
