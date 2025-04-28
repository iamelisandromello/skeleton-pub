import { EnumAdapterFactory } from '@/main/factories/enum'
import { ErrorContainerFactory } from '@/main/factories/containers'
import { TreatmentErrorAdapter } from '@/main/adapters'

export class TreatmentErrorAdapterFactory {
  private static instance: TreatmentErrorAdapterFactory
  private instanceTreatmentErrorAdapter: TreatmentErrorAdapter | undefined

  public static getInstance(): TreatmentErrorAdapterFactory {
    if (!TreatmentErrorAdapterFactory.instance) {
      TreatmentErrorAdapterFactory.instance = new TreatmentErrorAdapterFactory()
    }

    return TreatmentErrorAdapterFactory.instance
  }

  public make(): TreatmentErrorAdapter {
    if (!this.instanceTreatmentErrorAdapter) {
      this.instanceTreatmentErrorAdapter = new TreatmentErrorAdapter(
        EnumAdapterFactory.getInstance().make(),
        ErrorContainerFactory.getInstance().make()
      )
    }
    return this.instanceTreatmentErrorAdapter
  }
}
