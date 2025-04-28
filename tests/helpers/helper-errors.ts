import type { ErrorContainerContract } from '@/application/contracts'

export const makeFakeError = (messageError: string) => new Error(messageError)

export const makeErrorContainer = (
  messageError: string
): ErrorContainerContract => ({
  make: jest.fn().mockReturnValue(makeFakeError(messageError))
})
