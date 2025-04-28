import type { Validation, InputType } from '@/presentation/interfaces'
import { Controller } from '@/presentation/controllers/controller-abstract'
import {
  type HttpResponse,
  type HttpRequest,
  success,
  badRequest,
  handleError
} from '@/presentation/helpers'
import type { ExampleUsecase } from '@/domain/usecases'

type Request = {
  email: string
  accessToken: string
}

export class ExampleController extends Controller {
  constructor(
    private readonly validation: Validation<InputType>,
    private readonly exampleService: ExampleUsecase
  ) {
    super()
  }

  override async perform(request: HttpRequest): Promise<HttpResponse> {
    const error = await this.validation.validate(request.body as InputType)
    if (error) return badRequest(error)

    const { email, accessToken } = request.body as Request

    if (typeof email !== 'string' || typeof accessToken !== 'string') {
      return badRequest(new Error('Invalid input types'))
    }

    const isResult = await this.exampleService.perform({
      email,
      accessToken
    })

    return isResult instanceof Error ? handleError(isResult) : success(isResult)
  }
}
