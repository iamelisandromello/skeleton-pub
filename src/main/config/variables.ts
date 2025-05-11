import env from 'env-var'

export const variables = {
  corsOriginPermission: env.get('CORS_ORIGIN_PERMISSION').required().asString(),
  queueSQS: env.get('EXAMPLE_QUEUE_URL').required().asString()
}
