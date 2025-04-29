import type { QueueMessage } from '@/domain/value-objects'

export interface PublisherContract {
  publish: <T>(message: QueueMessage<T>) => Promise<boolean>
}
