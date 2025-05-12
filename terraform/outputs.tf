output "lambda_arn" {
  value = aws_lambda_function.my_lambda_function.arn
}

output "bucket_name" {
  value = data.aws_s3_bucket.lambda_code_bucket.bucket
}

output "s3_bucket_name" {
  value = var.s3_bucket_name
}

output "lambda_function_name" {
  value = aws_lambda_function.my_lambda_function.function_name
}

# ===============================
# Outputs adicionais para a Fila SQS
# ===============================

output "sqs_queue_url" {
  value = aws_sqs_queue.my_queue.id
}

output "sqs_queue_arn" {
  value = aws_sqs_queue.my_queue.arn
}