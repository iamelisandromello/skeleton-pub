import { eventMock } from '@/domain/mocks'

const resource = '/blow/route'
const body = {
  email: 'johndoe@breathing.com'
}

export const exampleEventMock = {
  ...eventMock,
  httpMethod: 'POST',
  path: resource,
  resource,
  body: JSON.stringify(body)
}
