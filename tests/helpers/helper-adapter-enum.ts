import type { EnumContract } from '@/application/contracts'

export const makeEnumAdapter = (): EnumContract => ({
  fromValue: jest.fn().mockImplementation((_, key) => key),
  fromLabel: jest.fn().mockImplementation((_, label) => label),
  getLabel: jest.fn().mockImplementation(() => 'some-label'),
  getLabels: jest.fn().mockReturnValue(['some-label'])
})

export const makeFakeEnum = {
  SUCCESS: 'success',
  ERROR: 'error',
  CODE: 100
} as const
