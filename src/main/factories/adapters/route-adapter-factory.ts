import { RouteAdapter } from '@/main/adapters'
import type { Routes } from '@/main/config/abstract-routes'

export class RouteAdapterFactory {
  private static instance: RouteAdapterFactory
  private instanteRouterAdapter: RouteAdapter | undefined

  public static getInstance(): RouteAdapterFactory {
    if (!RouteAdapterFactory.instance) {
      RouteAdapterFactory.instance = new RouteAdapterFactory()
    }

    return RouteAdapterFactory.instance
  }

  public make(routes: Routes): RouteAdapter {
    if (!this.instanteRouterAdapter) {
      this.instanteRouterAdapter = new RouteAdapter(routes)
    }
    return this.instanteRouterAdapter
  }
}
