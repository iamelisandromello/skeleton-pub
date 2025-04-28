import {
  sqsClient,
  type SendMessageParams,
  type SendMessageResult,
  type DeleteMessageResult,
  type DeleteMessageParams,
  type ReceiveMessageCommandOutput
} from '@/infra/message-broker'

import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SendMessageCommand
} from '@aws-sdk/client-sqs'

export class SQSAdapter {
  async publish(
    params: SendMessageParams
  ): Promise<SendMessageResult | undefined> {
    try {
      const data: SendMessageResult = await sqsClient.send(
        new SendMessageCommand(params)
      )
      console.log('Success, message sent. MessageID:', data.MessageId)
      return data
    } catch (err) {
      console.log('Error', err)
    }
  }

  async deleteMessage(
    params: DeleteMessageParams
  ): Promise<DeleteMessageResult | undefined> {
    try {
      const data: ReceiveMessageCommandOutput = await sqsClient.send(
        new ReceiveMessageCommand(params)
      )
      if (data.Messages) {
        const deleteParams: DeleteMessageParams = {
          QueueUrl: params.QueueUrl,
          ReceiptHandle: data.Messages[0].ReceiptHandle
        }
        try {
          const data: DeleteMessageResult = await sqsClient.send(
            new DeleteMessageCommand(deleteParams)
          )
          console.log('Message deleted', data)
        } catch (error: unknown) {
          console.log('Error', error)
        }
      } else {
        console.log('No messages to delete')
      }
      return data
    } catch (error: unknown) {
      console.log('Receive Error', error)
    }
  }
}
