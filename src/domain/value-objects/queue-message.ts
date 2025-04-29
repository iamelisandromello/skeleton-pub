export interface QueueMessage<T> {
  type: string
  payload: T
}
