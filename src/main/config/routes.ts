import { Routes, type RouteConfig } from '@/main/config/abstract-routes'
import { ExampleControllerFactory } from '@/main/factories/controllers'

export class AppRoutes extends Routes {
  override getRoutes(): RouteConfig[] {
    return [
      {
        route: {
          path: '/blow/route',
          method: 'POST'
        },
        controller: ExampleControllerFactory.getInstance().make()
      }
    ]
  }
}
