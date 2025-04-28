import type { HttpRequest, HttpResponse } from '@/presentation/helpers'
import { Controller } from '@/presentation/controllers/controller-abstract'

import type {
  APIGatewayProxyEvent,
  APIGatewayEventRequestContext
} from 'aws-lambda'

export class ControllerStub extends Controller {
  perform = jest.fn<Promise<HttpResponse>, [HttpRequest]>()
}

export const makeFakeEvent = (
  overrides?: Partial<APIGatewayProxyEvent>
): APIGatewayProxyEvent => ({
  body: JSON.stringify({ key: 'value' }),
  headers: {},
  multiValueHeaders: {},
  httpMethod: 'POST',
  isBase64Encoded: false,
  path: '/fake-path',
  pathParameters: null,
  queryStringParameters: { foo: 'bar' },
  multiValueQueryStringParameters: null,
  stageVariables: null,
  requestContext: {
    accountId: '',
    apiId: '',
    authorizer: undefined,
    protocol: '',
    httpMethod: 'POST',
    identity: {
      accessKey: null,
      accountId: null,
      apiKey: null,
      apiKeyId: null,
      caller: null,
      clientCert: null,
      cognitoAuthenticationProvider: null,
      cognitoAuthenticationType: null,
      cognitoIdentityId: null,
      cognitoIdentityPoolId: null,
      principalOrgId: null,
      sourceIp: '',
      user: null,
      userAgent: null,
      userArn: null
    },
    path: '/fake-path',
    requestId: '',
    requestTimeEpoch: 0,
    resourceId: '',
    resourcePath: '',
    stage: ''
  } satisfies APIGatewayEventRequestContext,
  resource: '/',
  ...overrides
})
