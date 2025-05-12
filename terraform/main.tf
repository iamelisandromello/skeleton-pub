# =======================================
# 🌍 AWS PROVIDER CONFIGURATION
# =======================================
provider "aws" {
  region = var.region
}

# =======================================
# ☁️ S3 BUCKET (IMPORTADO, NÃO CRIAR)
# =======================================
# Usado para armazenar o artefato zip da função Lambda.
# Sempre reutilizado/importado. Não deve ser gerenciado pela criação.
data "aws_s3_bucket" "lambda_code_bucket" {
  bucket = "meu-unico-bucket-s3"
}

# =======================================
# 🔐 IAM ROLE E POLÍTICAS PARA LAMBDA
# =======================================
# Role básica de execução da Lambda
# Também deve ser importada caso exista.
resource "aws_iam_role" "lambda_execution_role" {
  name = "${var.project_name}_execution_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com"
        },
        Action = "sts:AssumeRole"
      }
    ]
  })
}

# Política de logs para CloudWatch
resource "aws_iam_role_policy" "lambda_logging_policy" {
  name = "${var.project_name}_logging_policy"
  role = aws_iam_role.lambda_execution_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Resource = "arn:aws:logs:${var.region}:*:log-group:/aws/lambda/${var.project_name}:*"
      }
    ]
  })
}

# =======================================
# 📊 CLOUDWATCH LOG GROUP
# =======================================
resource "aws_cloudwatch_log_group" "lambda_log_group" {
  name              = "/aws/lambda/${var.project_name}"
  retention_in_days = 14
}

# =======================================
# 🧠 FUNÇÃO LAMBDA
# =======================================
# Deve ser atualizada caso exista — nunca duplicada.
resource "aws_lambda_function" "my_lambda_function" {
  function_name = var.project_name
  role          = aws_iam_role.lambda_execution_role.arn
  handler       = "main/app.handler"
  runtime       = "nodejs20.x"
  s3_bucket     = data.aws_s3_bucket.lambda_code_bucket.bucket
  s3_key        = "${var.project_name}.zip"
  timeout       = 15

  environment {
    variables = var.lambda_env_vars
  }

  depends_on = [aws_iam_role_policy.lambda_logging_policy]
}

# =======================================
# 📬 SQS QUEUE + PERMISSÕES
# =======================================

# Fila SQS associada à aplicação
resource "aws_sqs_queue" "my_queue" {
  name = "${var.project_name}-queue"
}

# Política que permite à Lambda enviar mensagens para a fila SQS
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
