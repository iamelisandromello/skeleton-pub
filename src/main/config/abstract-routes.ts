import type { Controller } from '@/presentation/controllers/controller-abstract'

export interface Route {
  path: string
  method: string
}

export interface RouteConfig {
  route: Route
  controller: Controller
}

export abstract class Routes {
  abstract getRoutes(): RouteConfig[]
}
