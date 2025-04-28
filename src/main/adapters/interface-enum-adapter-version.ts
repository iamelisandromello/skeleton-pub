export interface EnumAdapterContract {
  toValue<TEnum extends EnumAdapterContract.EnumType>(
    enumObj: TEnum,
    enumKey: keyof TEnum
  ): EnumAdapterContract.AdapterResult<TEnum[keyof TEnum]>

  toEnum<TEnum extends EnumAdapterContract.EnumType>(
    enumObj: TEnum,
    value: TEnum[keyof TEnum]
  ): EnumAdapterContract.AdapterResult<keyof TEnum>

  hasKey<TEnum extends EnumAdapterContract.EnumType>(
    enumObj: TEnum,
    key: string
  ): boolean

  getKey<TEnum extends EnumAdapterContract.EnumType>(
    enumObj: TEnum,
    key: string
  ): EnumAdapterContract.AdapterResult<string>

  getAllKeys<TEnum extends EnumAdapterContract.EnumType>(
    enumObj: TEnum
  ): EnumAdapterContract.AdapterResult<string[]>

  getEnumValues<TEnum extends EnumAdapterContract.EnumType>(
    enumObj: TEnum
  ): EnumAdapterContract.AdapterResult<TEnum[keyof TEnum][]>
}

export namespace EnumAdapterContract {
  export type EnumType = Record<string, string | number>

  export type AdapterResult<T> = {
    success: boolean
    data?: T
    error?: string
  }
}
