import { ControllerStub, makeFakeEvent } from '@/tests/helpers'
import { AdapterLambda } from '@/main/adapters'

describe('AdapterLambda', () => {
  let controllerStub: ControllerStub
  let adapterLambda: AdapterLambda

  beforeEach(() => {
    controllerStub = new ControllerStub()
    adapterLambda = new AdapterLambda(controllerStub)
  })

  it('deve chamar controller.perform com HttpRequest correto', async () => {
    const fakeEvent = makeFakeEvent()
    const fakeResponse = { statusCode: 200, data: { ok: true } }
    controllerStub.perform.mockResolvedValueOnce(fakeResponse)

    await adapterLambda.handler(fakeEvent)

    expect(controllerStub.perform).toHaveBeenCalledWith({
      body: { key: 'value' },
      query: { foo: 'bar' },
      path: null
    })
  })

  it('deve retornar resposta formatada corretamente para sucesso', async () => {
    const fakeResponse = { statusCode: 200, data: { message: 'Success' } }
    controllerStub.perform.mockResolvedValueOnce(fakeResponse)

    const result = await adapterLambda.handler(makeFakeEvent())

    expect(result.statusCode).toBe(200)
    expect(result.body).toBe(JSON.stringify({ message: 'Success' }))
    expect(result.headers).toHaveProperty('Access-Control-Allow-Origin')
  })

  it('deve retornar erro formatado corretamente', async () => {
    const fakeResponse = { statusCode: 400, data: { message: 'Invalid input' } }
    controllerStub.perform.mockResolvedValueOnce(fakeResponse)

    const result = await adapterLambda.handler(makeFakeEvent())

    expect(result.statusCode).toBe(400)
    expect(result.body).toBe(JSON.stringify({ error: 'Invalid input' }))
  })

  it('deve retornar erro genérico se estrutura for inesperada', async () => {
    const fakeResponse = { statusCode: 500, data: 'Some internal error' }
    controllerStub.perform.mockResolvedValueOnce(fakeResponse)

    const result = await adapterLambda.handler(makeFakeEvent())

    expect(result.statusCode).toBe(500)
    expect(result.body).toBe(JSON.stringify({ error: 'Unknown error' }))
  })
})
