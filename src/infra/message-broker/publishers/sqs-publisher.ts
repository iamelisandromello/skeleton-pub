import type { PublisherContract } from '@/application/contracts/message-broker'
import type { QueueMessage } from '@/domain/value-objects'
import type { SQSAdapter, SendMessageParams } from '@/infra/message-broker/sqs'

export class SQSPublisher implements PublisherContract {
  constructor(
    private readonly sqsAdapter: SQSAdapter,
    private readonly queueUrl: string
  ) {}

  async publish<T>(message: QueueMessage<T>): Promise<boolean> {
    console.log('Publishing message to SQS:', message)
    const params: SendMessageParams = {
      QueueUrl: this.queueUrl,
      MessageBody: JSON.stringify(message)
    }

    console.log('SQS Message:', JSON.stringify(message, null, 2))

    const result = await this.sqsAdapter.publish(params)

    console.log('Publish Result:', result)

    return !!result
  }
}
