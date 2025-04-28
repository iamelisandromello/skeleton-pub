import { AppRoutes } from '@/main/config/routes'

export class AppRoutesFactory {
  private static instance: AppRoutesFactory
  private appRoutesInstance: AppRoutes | undefined

  public static getInstance(): AppRoutesFactory {
    if (!AppRoutesFactory.instance) {
      AppRoutesFactory.instance = new AppRoutesFactory()
    }

    return AppRoutesFactory.instance
  }

  public make(): AppRoutes {
    if (!this.appRoutesInstance) {
      this.appRoutesInstance = new AppRoutes()
    }
    return this.appRoutesInstance
  }
}
