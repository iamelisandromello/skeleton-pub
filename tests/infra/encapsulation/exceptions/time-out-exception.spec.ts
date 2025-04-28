import { TimeOutException } from '@/infra/encapsulation'

describe('TimeOutException', () => {
  it('deve criar uma instância com a mensagem e nome corretos', () => {
    const error = new TimeOutException()

    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('Completion of the process by waiting time!!')
    expect(error.name).toBe('TimeOutError')
  })
})
