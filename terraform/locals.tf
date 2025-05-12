locals {
  # Identificadores padronizados
  lambda_name          = "${var.project_name}${local.environment_suffix}"
  lambda_role_name     = "${var.project_name}_execution_role"
  logging_policy_name  = "${var.project_name}_logging_policy"
  publish_policy_name  = "${var.project_name}-lambda-sqs-publish"
  environment_suffix   = var.environment == "prod" ? "" : "-${var.environment}"

  # Infraestrutura associada
  s3_bucket_name       = var.s3_bucket_name
  log_group_name       = "/aws/lambda/${var.project_name}"
  s3_object_key        = "${var.project_name}.zip"  
  queue_name           = "${var.project_name}-queue"
}
