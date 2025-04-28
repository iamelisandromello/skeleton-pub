export const TypeValidator = {
  isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null
  },

  hasProperty<T extends object, K extends string>(
    obj: T,
    prop: K
  ): obj is T & Record<K, unknown> {
    return Object.prototype.hasOwnProperty.call(obj, prop)
  },

  isString(value: unknown): value is string {
    return typeof value === 'string'
  },

  isNumber(value: unknown): value is number {
    return typeof value === 'number' && !Number.isNaN(value)
  },

  isBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean'
  },

  isArray(value: unknown): value is unknown[] {
    return Array.isArray(value)
  }
}
