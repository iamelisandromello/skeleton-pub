export interface FindRepository<T, R> {
  find: (filters?: T) => Promise<R>
}
