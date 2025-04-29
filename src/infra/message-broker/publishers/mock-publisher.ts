import type { PublisherContract } from '@/application/contracts/message-broker'
import type { QueueMessage } from '@/domain/value-objects'

export class MockPublisher implements PublisherContract {
  async publish<T>(message: QueueMessage<T>): Promise<boolean> {
    console.log('Queue Message:', JSON.stringify(message, null, 2))

    return true
  }
}
