locals {
  # Identificadores padronizados
  lambda_name          = var.project_name
  lambda_role_name     = "${var.project_name}_execution_role"
  logging_policy_name  = "${var.project_name}_logging_policy"
  publish_policy_name  = "${var.project_name}-lambda-sqs-publish"

  # Infraestrutura associada
  log_group_name       = "/aws/lambda/${var.project_name}"
  s3_object_key        = "${var.project_name}.zip"
  queue_name           = "${var.project_name}-queue"
}