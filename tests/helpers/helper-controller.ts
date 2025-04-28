import type { Controller } from '@/presentation/controllers/controller-abstract'

export const makeFakeController = (): Controller => ({
  perform: jest.fn(),
  handle: jest.fn()
})
