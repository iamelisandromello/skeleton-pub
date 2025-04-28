import { eventMock } from '@/domain/mocks'

const resource = '/blow/route'
const body = {
  email: 'elisandromello@hotmail.com',
  accessToken: process.env.MOCK_ACCESS_TOKEN
}

export const exampleEventMock = {
  ...eventMock,
  httpMethod: 'POST',
  path: resource,
  resource,
  body: JSON.stringify(body)
}
