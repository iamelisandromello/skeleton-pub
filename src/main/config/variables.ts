import env from 'env-var'

export const variables = {
  corsOriginPermission: env.get('CORS_ORIGIN_PERMISSION').required().asString(),
  timezone: env.get('TZ').required().asString(),
  queueSQS: env.get('EXAMPLE_QUEUE_URL').required().asString(),
  dbMySql: {
    host: env.get('DB_MYSQL_HOST').required().asString(),
    user: env.get('DB_MYSQL_USER').required().asString(),
    pass: env.get('DB_MYSQL_PASS').required().asString(),
    name: env.get('DB_MYSQL_NAME').required().asString(),
    port: env.get('DB_MYSQL_PORT').required().asInt(),
    ssl: env.get('RDS_PROXY_SSL').required().asString(),
    rdsProxy: env.get('RDS_PROXY_DB_MYSQL').required().asString()
  },
  dbMongo: {
    user: env.get('DB_MONGO_USER').required().asString(),
    pass: env.get('DB_MONGO_PASSWORD').required().asString(),
    url: env.get('DB_MONGO_URL').required().asString(),
    port: env.get('DB_MONGO_PORT').required().asInt(),
    ssl: env.get('DB_MONGO_SSL').required().asString()
  }
}
