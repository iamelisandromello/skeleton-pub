// modules/lambda/main.tf
resource "aws_lambda_function" "lambda" {
  function_name = var.lambda_name
  role          = var.role_arn
  handler       = "main/app.handler"
  runtime       = "nodejs20.x"
  s3_bucket     = var.s3_bucket
  s3_key        = var.s3_key
  timeout       = 15

  environment {
    variables = var.environment_variables
  }
}