import { EmailValidatorAdapter } from '@/infra/validators'
import validator from 'validator'

// Mocka o pacote 'validator'
jest.mock('validator', () => ({
  isEmail: jest.fn()
}))

describe('EmailValidatorAdapter', () => {
  let sut: EmailValidatorAdapter

  beforeEach(() => {
    sut = new EmailValidatorAdapter()
  })

  it('deve retornar true se validator retornar true', async () => {
    ;(validator.isEmail as jest.Mock).mockReturnValueOnce(true)

    const result = await sut.isValid('valid@email.com')
    expect(result).toBe(true)
  })

  it('deve retornar false se validator retornar false', async () => {
    ;(validator.isEmail as jest.Mock).mockReturnValueOnce(false)

    const result = await sut.isValid('invalid-email')
    expect(result).toBe(false)
  })

  it('deve retornar false se validator lançar exceção', async () => {
    ;(validator.isEmail as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Validator error')
    })

    const result = await sut.isValid('any@email.com')
    expect(result).toBe(false)
  })

  it('deve chamar validator.isEmail com o e-mail correto', async () => {
    const email = 'check@call.com'
    await sut.isValid(email)
    expect(validator.isEmail).toHaveBeenCalledWith(email)
  })
})
