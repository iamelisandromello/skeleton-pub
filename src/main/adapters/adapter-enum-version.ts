import type { EnumAdapterContract } from './interface-enum-adapter-version'

export class EnumAdapter implements EnumAdapterContract {
  private keysCache: Map<object, string[]> = new Map()
  private valuesCache: Map<object, Array<string | number>> = new Map()

  private validateEnum<TEnum extends EnumAdapterContract.EnumType>(
    enumObj: TEnum
  ): EnumAdapterContract.AdapterResult<void> {
    if (!enumObj || typeof enumObj !== 'object') {
      return {
        success: false,
        error: 'Enum inválido ou não fornecido'
      }
    }
    return { success: true }
  }

  public toValue<TEnum extends EnumAdapterContract.EnumType>(
    enumObj: TEnum,
    enumKey: keyof TEnum
  ): EnumAdapterContract.AdapterResult<TEnum[keyof TEnum]> {
    const validation = this.validateEnum(enumObj)
    if (!validation.success)
      return validation as EnumAdapterContract.AdapterResult<TEnum[keyof TEnum]>

    if (!(enumKey in enumObj)) {
      return {
        success: false,
        error: `Valor não encontrado para a chave: ${String(enumKey)}`
      }
    }

    return {
      success: true,
      data: enumObj[enumKey]
    }
  }

  public toEnum<TEnum extends EnumAdapterContract.EnumType>(
    enumObj: TEnum,
    value: TEnum[keyof TEnum]
  ): EnumAdapterContract.AdapterResult<keyof TEnum> {
    const enumKey = Object.keys(enumObj).find((key) => enumObj[key] === value)

    if (!enumKey) {
      return {
        success: false,
        error: `Chave não encontrada para o valor: ${value}`
      }
    }

    return {
      success: true,
      data: enumKey as keyof TEnum
    }
  }

  public hasKey<TEnum extends EnumAdapterContract.EnumType>(
    enumObj: TEnum,
    key: string
  ): boolean {
    return key in enumObj
  }

  public getKey<TEnum extends EnumAdapterContract.EnumType>(
    enumObj: TEnum,
    key: string
  ): EnumAdapterContract.AdapterResult<string> {
    const validation = this.validateEnum(enumObj)
    if (!validation.success)
      return validation as EnumAdapterContract.AdapterResult<string>

    return this.hasKey(enumObj, key)
      ? { success: true, data: key }
      : { success: false, error: `Chave não encontrada: ${key}` }
  }

  public getAllKeys<TEnum extends EnumAdapterContract.EnumType>(
    enumObj: TEnum
  ): EnumAdapterContract.AdapterResult<string[]> {
    const validation = this.validateEnum(enumObj)
    if (!validation.success)
      return validation as EnumAdapterContract.AdapterResult<string[]>

    if (!this.keysCache.has(enumObj)) {
      const keys = Object.keys(enumObj).filter((key) =>
        Number.isNaN(Number(key))
      )
      this.keysCache.set(enumObj, keys)
    }

    return {
      success: true,
      data: this.keysCache.get(enumObj) ?? []
    }
  }

  public getEnumValues<TEnum extends EnumAdapterContract.EnumType>(
    enumObj: TEnum
  ): EnumAdapterContract.AdapterResult<TEnum[keyof TEnum][]> {
    const validation = this.validateEnum(enumObj)
    if (!validation.success)
      return validation as EnumAdapterContract.AdapterResult<
        TEnum[keyof TEnum][]
      >

    if (!this.valuesCache.has(enumObj)) {
      const values = Object.values(enumObj).filter(
        (value) => typeof value === 'string' || typeof value === 'number'
      )
      this.valuesCache.set(enumObj, values)
    }

    return {
      success: true,
      data: this.valuesCache.get(enumObj) as TEnum[keyof TEnum][]
    }
  }
}
