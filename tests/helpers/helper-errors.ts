import { makeEnumAdapter } from '@/tests/helpers'
import type { TreatmentErrorContract } from '@/application/contracts/treatment-error'
import type { ErrorContainerContract } from '@/application/contracts'
import { TreatmentErrorAdapter } from '@/main/adapters'

export const makeFakeError = (messageError: string) => new Error(messageError)

export const makeErrorContainer = (
  messageError: string
): ErrorContainerContract => ({
  make: jest.fn().mockReturnValue(makeFakeError(messageError))
})

export const fakeLaunchError = (
  params: TreatmentErrorContract.Params
): TreatmentErrorContract.Result => {
  const { errorDescription, messageDescription } = params

  const enumAdapter = makeEnumAdapter()
  const errorContainer = makeErrorContainer(
    messageDescription ?? 'Default error message'
  )
  const mockTreatmentError = new TreatmentErrorAdapter(
    enumAdapter,
    errorContainer
  )
  const isError = mockTreatmentError.launchError({
    errorDescription,
    messageDescription
  })
  return isError
}
