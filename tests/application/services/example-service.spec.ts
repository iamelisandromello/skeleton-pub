import { fakeLaunchError } from '@/tests/helpers'
import { ErrorsEnum } from '@/domain/enums'
import { ExampleService } from '@/application/services'
import type { ExampleQueueTreaty } from '@/application/services/tasks'
import type { TreatmentErrorContract } from '@/application/contracts'

describe('ExampleService', () => {
  let sut: ExampleService
  let examplePubQueue: jest.Mocked<ExampleQueueTreaty>
  let treatment: jest.Mocked<TreatmentErrorContract>

  beforeEach(() => {
    examplePubQueue = {
      perform: jest.fn()
    } as jest.Mocked<ExampleQueueTreaty>
    treatment = {
      launchError: jest.fn(),
      setMessage: jest.fn()
    } as jest.Mocked<TreatmentErrorContract>
    sut = new ExampleService(examplePubQueue, treatment)
  })

  describe('perform', () => {
    const mockParams = {
      email: 'test@example.com'
    }

    const mockQueueParams = {
      email: 'test@example.com',
      name: 'John Doe',
      username: 'johndoe'
    }

    it('deve retornar os dados do usuário quando encontrado', async () => {
      const mockPubData: boolean = true
      examplePubQueue.perform.mockResolvedValueOnce(mockPubData)

      const result = await sut.perform(mockParams)

      expect(examplePubQueue.perform).toHaveBeenCalledWith(mockQueueParams)
      expect(result).toEqual(true)
    })

    it('deve lançar erro quando a mensagem não for publicada com sucesso', async () => {
      examplePubQueue.perform.mockResolvedValueOnce(false as unknown as boolean)

      const expectedError = fakeLaunchError({
        errorDescription: ErrorsEnum.PUBLISH_ERROR,
        messageDescription: 'Error publishing to queue: false"'
      })

      treatment.launchError.mockReturnValueOnce(expectedError)

      const result = await sut.perform(mockParams)

      expect(examplePubQueue.perform).toHaveBeenCalledWith(mockQueueParams)
      expect(treatment.launchError).toHaveBeenCalledWith({
        errorDescription: ErrorsEnum.PUBLISH_ERROR,
        messageDescription: 'Error publishing to queue: false'
      })
      expect(result).toEqual(expectedError)
    })
  })
})
