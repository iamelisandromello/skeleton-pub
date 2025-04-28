import { ExampleService } from '@/application/services'
import { ErrorsEnum } from '@/domain/enums'
import type { ExampleLoadUserTreaty } from '@/application/services/tasks'
import type { TreatmentErrorContract } from '@/application/contracts'
import type { UserEntity } from '@/domain/entities'

describe('ExampleService', () => {
  let sut: ExampleService
  let exampleLoadUser: jest.Mocked<ExampleLoadUserTreaty>
  let treatment: jest.Mocked<TreatmentErrorContract>

  beforeEach(() => {
    exampleLoadUser = {
      perform: jest.fn()
    } as jest.Mocked<ExampleLoadUserTreaty>
    treatment = {
      launchError: jest.fn(),
      setMessage: jest.fn()
    } as jest.Mocked<TreatmentErrorContract>
    sut = new ExampleService(exampleLoadUser, treatment)
  })

  describe('perform', () => {
    const mockParams = {
      email: 'test@example.com',
      accessToken: 'valid-token'
    }

    it('deve retornar os dados do usuário quando encontrado', async () => {
      const mockUserData: UserEntity = {
        email: 'test@example.com',
        name: 'Test User',
        username: 'testuser'
      }
      exampleLoadUser.perform.mockResolvedValueOnce(mockUserData)

      const result = await sut.perform(mockParams)

      expect(exampleLoadUser.perform).toHaveBeenCalledWith({
        email: mockParams.email
      })
      expect(result).toEqual({ data: mockUserData })
    })

    it('deve lançar erro quando o usuário não for encontrado', async () => {
      exampleLoadUser.perform.mockResolvedValueOnce(
        null as unknown as UserEntity
      )
      const expectedError = new Error('User not found')
      treatment.launchError.mockReturnValueOnce(expectedError)

      const result = await sut.perform(mockParams)

      expect(exampleLoadUser.perform).toHaveBeenCalledWith({
        email: mockParams.email
      })
      expect(treatment.launchError).toHaveBeenCalledWith({
        errorDescription: ErrorsEnum.NOT_FOUND_USER_ERROR,
        messageDescription: `User not found: ${mockParams.email}`
      })
      expect(result).toEqual(expectedError)
    })
  })
})
