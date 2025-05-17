// modules/sqs/main.tf
resource "aws_sqs_queue" "queue" {
  name = var.queue_name
}
