import { ExampleController } from '@/presentation/controllers'
import type { Validation, InputType } from '@/presentation/interfaces'
import type { ExampleUsecase } from '@/domain/usecases'
import { success, badRequest, handleError } from '@/presentation/helpers'
import type { HttpRequest } from '@/presentation/helpers'

const makeValidation = (): Validation<InputType> => {
  class ValidationStub implements Validation<InputType> {
    async validate(input: InputType): Promise<Error | undefined> {
      return undefined
    }
  }
  return new ValidationStub()
}

const makeExampleService = (): ExampleUsecase => {
  class ExampleServiceStub implements ExampleUsecase {
    async perform(
      params: ExampleUsecase.Params
    ): Promise<ExampleUsecase.Result> {
      return true
    }
  }
  return new ExampleServiceStub()
}

interface SutTypes {
  sut: ExampleController
  validationStub: Validation<InputType>
  exampleServiceStub: ExampleUsecase
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const exampleServiceStub = makeExampleService()
  const sut = new ExampleController(validationStub, exampleServiceStub)
  return {
    sut,
    validationStub,
    exampleServiceStub
  }
}

describe('ExampleController', () => {
  test('Deve retornar 400 se a validação falhar', async () => {
    const { sut, validationStub } = makeSut()
    jest
      .spyOn(validationStub, 'validate')
      .mockResolvedValueOnce(new Error('Erro de validação'))

    const httpRequest: HttpRequest = {
      body: {
        email: 'test@example.com',
        accessToken: 'any_token'
      },
      query: {},
      path: '/example'
    }

    const httpResponse = await sut.perform(httpRequest)
    expect(httpResponse).toEqual(badRequest(new Error('Erro de validação')))
  })

  test('Deve retornar 400 se os tipos dos campos forem inválidos', async () => {
    const { sut } = makeSut()

    const httpRequest: HttpRequest = {
      body: {
        email: 123,
        accessToken: true
      },
      query: {},
      path: '/example'
    }

    const httpResponse = await sut.perform(httpRequest)
    expect(httpResponse).toEqual(badRequest(new Error('Invalid input types')))
  })

  test('Deve chamar o serviço de exemplo com os valores corretos', async () => {
    const { sut, exampleServiceStub } = makeSut()
    const performSpy = jest.spyOn(exampleServiceStub, 'perform')

    const httpRequest: HttpRequest = {
      body: {
        email: 'test@example.com'
      },
      query: {},
      path: '/example'
    }

    await sut.perform(httpRequest)
    expect(performSpy).toHaveBeenCalledWith({
      email: 'test@example.com'
    })
  })

  test('Deve retornar 200 com o resultado do serviço em caso de sucesso', async () => {
    const { sut } = makeSut()

    const httpRequest: HttpRequest = {
      body: {
        email: 'test@example.com'
      },
      query: {},
      path: '/example'
    }

    const httpResponse = await sut.perform(httpRequest)
    expect(httpResponse).toEqual(
      success({
        data: 'Message successfully published to SQS queue'
      })
    )
  })

  it('deve retornar handleError se o serviço retornar um erro', async () => {
    const { sut, exampleServiceStub } = makeSut()
    jest
      .spyOn(exampleServiceStub, 'perform')
      .mockResolvedValueOnce(new Error('Erro de validação'))

    const httpRequest: HttpRequest = {
      body: {
        email: 'test@example.com',
        accessToken: 'any_token'
      },
      query: {},
      path: '/example'
    }

    const httpResponse = await sut.perform(httpRequest)
    expect(httpResponse).toEqual(handleError(new Error('Erro de validação')))
  })
})
