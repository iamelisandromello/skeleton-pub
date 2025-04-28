// import { variables } from '@/main/config/variables'

export type CorsConfig = {
  'Access-Control-Allow-Origin': string
  'Access-Control-Allow-Methods': string
  'Access-Control-Allow-Headers': string
}

export const cors = (): CorsConfig => ({
  //'Access-Control-Allow-Origin': variables.corsOriginPermission,
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*'
})
