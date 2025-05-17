terraform/
├── main.tf
├── variables.tf
├── outputs.tf
├── locals.tf
└── modules/
    ├── lambda/
    │   ├── main.tf
    │   ├── variables.tf
    │   └── outputs.tf
    ├── iam/
    │   ├── main.tf
    │   ├── variables.tf
    │   └── outputs.tf
    ├── cloudwatch/
    │   ├── main.tf
    │   ├── variables.tf
    │   └── outputs.tf
    └── sqs/
        ├── main.tf
        ├── variables.tf
        └── outputs.tf

🔸 modules/iam/
Crie:

aws_iam_role.lambda_execution_role

aws_iam_role_policy.lambda_logging_policy

aws_iam_role_policy.lambda_sqs_publish_policy


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
    bucket = local.s3_bucket_name
  }

  # =======================================
  # 🔐 IAM ROLE E POLÍTICAS PARA LAMBDA
  # =======================================
  # Role básica de execução da Lambda
  # Também deve ser importada caso exista.
  resource "aws_iam_role" "lambda_execution_role" {
    name = local.lambda_role_name

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
    
    lifecycle {
      prevent_destroy = true
      create_before_destroy = false
      ignore_changes = [assume_role_policy] # ← evita pequenos conflitos na política
    }
  }

  # Política de logs para CloudWatch
  resource "aws_iam_role_policy" "lambda_logging_policy" {
    name = local.logging_policy_name
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
          Resource = "arn:aws:logs:${var.region}:*:log-group:${local.log_group_name}:*"
        }
      ]
    })
  }

  # =======================================
  # 📊 CLOUDWATCH LOG GROUP
  # =======================================
  resource "aws_cloudwatch_log_group" "lambda_log_group" {
    name              = local.log_group_name
    retention_in_days = 14

    lifecycle {
      prevent_destroy = true
      create_before_destroy = false
    }
  }

  # =======================================
  # 🧠 FUNÇÃO LAMBDA
  # =======================================
  # Deve ser atualizada caso exista — nunca duplicada.
  resource "aws_lambda_function" "my_lambda_function" {
    function_name = local.lambda_name 
    role          = aws_iam_role.lambda_execution_role.arn
    handler       = "main/app.handler"
    runtime       = "nodejs20.x"
    s3_bucket     = data.aws_s3_bucket.lambda_code_bucket.bucket
    s3_key        = local.s3_object_key
    timeout       = 15

    environment {
      variables = var.global_env_vars
    }

    depends_on = [aws_iam_role_policy.lambda_logging_policy]
  }

  # =======================================
  # 📬 SQS QUEUE + PERMISSÕES
  # =======================================

  # Fila SQS associada à aplicação
  resource "aws_sqs_queue" "my_queue" {
    name = local.queue_name
  }

  # Política que permite à Lambda enviar mensagens para a fila SQS
  resource "aws_iam_role_policy" "lambda_sqs_publish_policy" {
    name = local.publish_policy_name
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
