import type { Routes, RouteConfig } from '@/main/config/abstract-routes'
import type { Controller } from '@/presentation/controllers/controller-abstract'

export const makeRoutes = (controller: Controller): Routes => ({
  getRoutes: () =>
    [
      {
        route: { path: '/example', method: 'POST' },
        controller
      }
    ] as RouteConfig[]
})
