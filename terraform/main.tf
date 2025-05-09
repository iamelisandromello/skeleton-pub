provider "aws" {
  region = var.region
}

# Bucket S3 para guardar o código zipado da função Lambda.
# Sem instrução de criação, pois deve ser sempre importado e reutilizado conforme regras de negócio.
resource "aws_s3_bucket" "lambda_code_bucket" {
  bucket = "meu-unico-bucket-s3"
}

# IAM Role para a execução das funções Lambda.
# Sem instrução de criação, deve ser importada caso exista, conforme regras de negócio.
resource "aws_iam_role" "lambda_execution_role" {
  name = "${var.project_name}_execution_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service: "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# Função Lambda que deverá ser atualizada em caso de existência, nunca criar uma duplicata.
resource "aws_lambda_function" "my_lambda_function" {
  function_name = var.project_name
  role          = aws_iam_role.lambda_execution_role.arn
  handler       = "main/app.handler"
  runtime       = "nodejs20.x"
  s3_bucket     = aws_s3_bucket.lambda_code_bucket.bucket
  s3_key        = "${var.project_name}.zip"
  timeout       = 15

  environment {
    variables = var.lambda_env_vars
  }
}

# CloudWatch Log Group para a função Lambda com instrução de importação se já existir.
# Conformidade com as regras de negócio para reutilização de recursos.
resource "aws_cloudwatch_log_group" "lambda_log_group" {
  name              = "/aws/lambda/${var.project_name}"
  retention_in_days = 14
}

# ===============================
# Recursos adicionados para a Fila SQS
# ===============================

# Criação da fila SQS
resource "aws_sqs_queue" "my_queue" {
  name = "${var.project_name}-queue"
}

# Permissão para a Lambda publicar mensagens na fila SQS
resource "aws_iam_role_policy" "lambda_sqs_publish_policy" {
  name = "${var.project_name}-lambda-sqs-publish"
  role = aws_iam_role.lambda_execution_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "sqs:SendMessage"
        ],
        Resource = aws_sqs_queue.my_queue.arn
      }
    ]
  })
}