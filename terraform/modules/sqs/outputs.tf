// modules/sqs/outputs.tf
output "queue_arn" {
  value = aws_sqs_queue.queue.arn
}
