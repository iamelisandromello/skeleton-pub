import { EnumAdapter } from '@/main/adapters'
import { ErrorContainerFactory } from '@/main/factories/containers'

export class EnumAdapterFactory {
  private static instance: EnumAdapterFactory
  private instanceEnumAdapter: EnumAdapter | undefined

  public static getInstance(): EnumAdapterFactory {
    if (!EnumAdapterFactory.instance) {
      EnumAdapterFactory.instance = new EnumAdapterFactory()
    }

    return EnumAdapterFactory.instance
  }

  public make(): EnumAdapter {
    if (!this.instanceEnumAdapter) {
      this.instanceEnumAdapter = new EnumAdapter(
        ErrorContainerFactory.getInstance().make()
      )
    }
    return this.instanceEnumAdapter
  }
}
