export interface EnumContract {
  fromValue: <T>(enumerable: EnumContract.Type, value: unknown) => T
  fromLabel: <T>(enumerable: EnumContract.Type, label: string) => T
  getLabel: (
    enumerable: EnumContract.Type,
    enumerableInstance: unknown
  ) => string
  getLabels: (enumerable: EnumContract.Type) => string[]
}
export namespace EnumContract {
  export type Type = { [label: string]: unknown }
}
