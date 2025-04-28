import {
  ExampleLoadUserTask,
  type ExampleLoadUserTreaty
} from '@/application/services/tasks'
import { ErrorsEnum } from '@/domain/enums'
import type { TreatmentErrorContract } from '@/application/contracts'
import type { ExampleFindUserRepository } from '@/application/contracts/database'
import type { UserEntity } from '@/domain/entities'

describe('ExampleLoadUserTask', () => {
  let sut: ExampleLoadUserTask
  let exampleFindUserRepo: jest.Mocked<ExampleFindUserRepository>
  let treatment: jest.Mocked<TreatmentErrorContract>

  const mockParams: ExampleLoadUserTreaty.Params = {
    email: 'test@example.com'
  }

  beforeEach(() => {
    exampleFindUserRepo = {
      find: jest.fn()
    } as jest.Mocked<ExampleFindUserRepository>
    treatment = {
      launchError: jest.fn(),
      setMessage: jest.fn()
    } as jest.Mocked<TreatmentErrorContract>
    sut = new ExampleLoadUserTask(exampleFindUserRepo, treatment)
  })

  describe('perform', () => {
    it('deve chamar o repositório com os parâmetros corretos', async () => {
      await sut.perform(mockParams)
      expect(exampleFindUserRepo.find).toHaveBeenCalledWith(mockParams)
    })

    it('deve retornar os dados do usuário quando encontrado', async () => {
      const mockUserData: UserEntity = {
        email: 'test@example.com',
        name: 'Test User',
        username: 'testuser'
      }
      exampleFindUserRepo.find.mockResolvedValueOnce(mockUserData)

      const result = await sut.perform(mockParams)

      expect(result).toEqual(mockUserData)
    })

    it('deve lançar erro quando o usuário não for encontrado', async () => {
      exampleFindUserRepo.find.mockResolvedValueOnce(
        false as unknown as UserEntity
      )
      const expectedError = new Error('User not found')
      treatment.launchError.mockReturnValueOnce(expectedError)

      const result = await sut.perform(mockParams)

      expect(exampleFindUserRepo.find).toHaveBeenCalledWith(mockParams)

      expect(result).toEqual(false)
    })
  })
})
