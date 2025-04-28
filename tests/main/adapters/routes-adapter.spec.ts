import { makeFakeEvent, makeFakeController, makeRoutes } from '@/tests/helpers'
import { RouteAdapter, AdapterLambda } from '@/main/adapters'
import type { Routes } from '@/main/config/abstract-routes'
import type { Controller } from '@/presentation/controllers/controller-abstract'

jest.mock('@/main/adapters/lambda-function-adapter') // mocka o AdapterLambda

interface SutTypes {
  sut: RouteAdapter
  controllerStub: Controller
  routesStub: Routes
}

const makeSut = (): SutTypes => {
  const controllerStub = makeFakeController()
  const routesStub = makeRoutes(controllerStub)
  const sut = new RouteAdapter(routesStub)
  return {
    sut,
    controllerStub,
    routesStub
  }
}

describe('RouteAdapter', () => {
  it('deve delegar para AdapterLambda se a rota existir', async () => {
    const { controllerStub, sut } = makeSut()

    const event = makeFakeEvent()

    const mockHandler = jest
      .fn()
      .mockResolvedValue({ statusCode: 200, body: '{}' })
    ;(AdapterLambda as jest.Mock).mockImplementation(() => ({
      handler: mockHandler
    }))

    const result = await sut.adaptRoute({
      event,
      route: '/example',
      method: 'POST'
    })

    expect(AdapterLambda).toHaveBeenCalledWith(controllerStub)
    expect(mockHandler).toHaveBeenCalledWith(event)
    expect(result).toEqual({ statusCode: 200, body: '{}' })
  })

  it('deve retornar false se a rota não for encontrada', async () => {
    const { sut } = makeSut()

    const result = await sut.adaptRoute({
      event: makeFakeEvent(),
      route: '/not-found',
      method: 'GET'
    })

    expect(result).toBe(false)
  })
})
