export interface Validation<T> {
  validate: (input: T) => Promise<Error | undefined>
}
