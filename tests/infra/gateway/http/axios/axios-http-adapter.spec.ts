import { mockAxiosRequest } from '@/tests/helpers'
import { HttpMethodEnum } from '@/domain/enums'
import { AxiosHttpClient } from '@/infra/gateway/http'

import axios from 'axios'

describe('AxiosHttpClient', () => {
  jest.spyOn(axios, 'request')
  const mockedRequest = mockAxiosRequest()

  let sut: AxiosHttpClient

  beforeEach(() => {
    sut = new AxiosHttpClient()
  })

  it('deve retornar statusCode e body em resposta bem-sucedida', async () => {
    const mockResponse = {
      status: 200,
      data: { message: 'Success' }
    }

    mockedRequest.mockResolvedValueOnce(mockResponse)

    const httpRequest = {
      url: 'https://api.example.com',
      method: HttpMethodEnum.GET,
      headers: { Authorization: 'Bearer token' }
    }

    const response = await sut.request<typeof mockResponse.data>(httpRequest)

    expect(response).toEqual({
      statusCode: 200,
      body: { message: 'Success' }
    })

    expect(mockedRequest).toHaveBeenCalledWith({
      url: httpRequest.url,
      method: httpRequest.method,
      headers: httpRequest.headers
    })
  })

  it('deve retornar statusCode e body em erro HTTP com resposta', async () => {
    const errorResponse = {
      status: 400,
      data: { error: 'Invalid data' }
    }

    const axiosError = {
      isAxiosError: true,
      response: errorResponse
    }

    mockedRequest.mockRejectedValueOnce(axiosError)

    const httpRequest = {
      url: 'https://api.example.com',
      method: HttpMethodEnum.POST,
      body: { name: 'Invalid' },
      headers: {}
    }

    const response = await sut.request<typeof errorResponse.data>(httpRequest)

    expect(response).toEqual({
      statusCode: 400,
      body: { error: 'Invalid data' }
    })
  })

  it('deve lançar erro desconhecido caso não seja um erro Axios com response', async () => {
    const unknownError = new Error('Unexpected failure')
    mockedRequest.mockRejectedValueOnce(unknownError)

    const httpRequest = {
      url: 'https://api.example.com',
      method: HttpMethodEnum.GET,
      headers: {}
    }

    await expect(sut.request(httpRequest)).rejects.toThrow('Unexpected failure')
  })
})
