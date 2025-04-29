import type { PublisherContract } from '@/application/contracts/message-broker'
import { SQSPublisher } from '@/infra/message-broker/publishers'
import { SQSAdapter } from '@/infra/message-broker/sqs'

export class SQSPublisherFactory {
  private static instance: SQSPublisherFactory
  private instanceSQSPublisher: SQSPublisher | undefined

  public static getInstance(): SQSPublisherFactory {
    if (!SQSPublisherFactory.instance) {
      SQSPublisherFactory.instance = new SQSPublisherFactory()
    }

    return SQSPublisherFactory.instance
  }

  public make(queueUrl: string): PublisherContract {
    if (!this.instanceSQSPublisher) {
      this.instanceSQSPublisher = new SQSPublisher(new SQSAdapter(), queueUrl)
    }
    return this.instanceSQSPublisher
  }
}
