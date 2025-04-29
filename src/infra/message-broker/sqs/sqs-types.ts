export interface Message {
  MessageId?: string
  ReceiptHandle?: string
  MD5OfBody?: string
  Body?: string
  Attributes?: Record<string, string>
  MD5OfMessageAttributes?: string
  MessageAttributes?: Record<string, MessageAttributeValue>
}

type MessageSystemAttributeValue = {
  StringValue?: string
  BinaryValue?: Uint8Array
  StringListValues?: string[]
  BinaryListValues?: Uint8Array[]
  DataType: string | undefined
}

type MessageAttributeValue = {
  StringValue?: string
  BinaryValue?: Uint8Array
  StringListValues?: string[]
  BinaryListValues?: Uint8Array[]
  DataType: string | undefined
}

export type SendMessageParams = {
  QueueUrl: string | undefined
  MessageBody: string | undefined
  DelaySeconds?: number
  MessageAttributes?: Record<string, MessageAttributeValue>
  MessageSystemAttributes?: Record<string, MessageSystemAttributeValue>
  MessageDeduplicationId?: string
  MessageGroupId?: string
}

export interface SendMessageResult extends MetadataBearer {
  MD5OfMessageBody?: string
  MD5OfMessageAttributes?: string
  MD5OfMessageSystemAttributes?: string
  MessageId?: string
  SequenceNumber?: string
}

export type DeleteMessageParams = {
  QueueUrl: string | undefined
  ReceiptHandle: string | undefined
}

export interface DeleteMessageResult extends MetadataBearer {}

export type MessageResponse = {
  MD5OfMessageBody?: string
  MD5OfMessageAttributes?: string
  MD5OfMessageSystemAttributes?: string
  MessageId?: string
  SequenceNumber?: string
}

export interface ReceiveMessageCommandOutput
  extends ReceiveMessageResult,
    MetadataBearer {}

export interface ReceiveMessageResult {
  Messages?: Message[]
}

export interface MetadataBearer {
  $metadata: ResponseMetadata
}

export interface ResponseMetadata {
  httpStatusCode?: number
  requestId?: string
  extendedRequestId?: string
  cfId?: string
  attempts?: number
  totalRetryDelay?: number
}
