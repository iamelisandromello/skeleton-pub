import type {
  HttpRequest,
  HttpResponse,
  HttpContract
} from '@/application/contracts/http'

import axios, { type AxiosResponse } from 'axios'

export class AxiosHttpClient implements HttpContract {
  async request<R>(data: HttpRequest): Promise<HttpResponse<R>> {
    let axiosResponse: AxiosResponse
    try {
      axiosResponse = await axios.request({
        url: data.url,
        method: data.method,
        data: data.body,
        headers: data.headers
      })
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        axiosResponse = error.response
        return { statusCode: axiosResponse.status, body: axiosResponse.data }
      }
      throw error
    }

    return {
      statusCode: axiosResponse.status,
      body: axiosResponse.data
    }
  }
}
