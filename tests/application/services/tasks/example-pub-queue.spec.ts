import {
  ExamplePubQueueTask,
  type ExampleQueueTreaty
} from '@/application/services/tasks'
import { ErrorsEnum } from '@/domain/enums'
import type { TreatmentErrorContract } from '@/application/contracts'
import type { PublisherContract } from '@/application/contracts/'
import type { UserEntity } from '@/domain/entities'

describe('ExampleLoadUserTask', () => {
  let sut: ExamplePubQueueTask
  let examplePub: jest.Mocked<PublisherContract>
  let treatment: jest.Mocked<TreatmentErrorContract>

  const mockParams: ExampleQueueTreaty.Params = {
    email: 'test@example.com',
    name: 'Test User',
    username: 'testuser'
  }

  const mockPayload = {
    type: 'process-payment-publi-post',
    payload: mockParams
  }

  beforeEach(() => {
    examplePub = {
      publish: jest.fn()
    } as jest.Mocked<PublisherContract>
    treatment = {
      launchError: jest.fn(),
      setMessage: jest.fn()
    } as jest.Mocked<TreatmentErrorContract>
    sut = new ExamplePubQueueTask(examplePub)
  })

  describe('perform', () => {
    it('deve chamar o serviço de publicação na fila com os parâmetros corretos', async () => {
      await sut.perform(mockParams)
      expect(examplePub.publish).toHaveBeenCalledWith(mockPayload)
    })

    it('deve retornar true quando a mesnagem for publicada com sucesso', async () => {
      const mockUserData: UserEntity = {
        email: 'test@example.com',
        name: 'Test User',
        username: 'testuser'
      }
      examplePub.publish.mockResolvedValueOnce(true)

      const result = await sut.perform(mockParams)

      expect(result).toEqual(true)
    })

    it('deve retornar false quando a mesnagem não for publicada na fila com sucesso', async () => {
      const mockUserData: UserEntity = {
        email: 'test@example.com',
        name: 'Test User',
        username: 'testuser'
      }
      examplePub.publish.mockResolvedValueOnce(false)

      const result = await sut.perform(mockParams)

      expect(result).toEqual(false)
    })

    /*     it('deve lançar erro quando o usuário não for encontrado', async () => {
      exampleFindUserRepo.find.mockResolvedValueOnce(
        false as unknown as UserEntity
      )
      const expectedError = new Error('User not found')
      treatment.launchError.mockReturnValueOnce(expectedError)

      const result = await sut.perform(mockParams)

      expect(exampleFindUserRepo.find).toHaveBeenCalledWith(mockParams)

      expect(result).toEqual(false)
    }) */
  })
})
