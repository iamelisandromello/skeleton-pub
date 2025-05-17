module "lambda" {
  source = "./modules/lambda"

  lambda_name        = local.lambda_name
  role_arn           = module.iam.role_arn
  s3_bucket          = data.aws_s3_bucket.lambda_code_bucket.bucket
  s3_key             = local.s3_object_key
  global_env_vars    = var.global_env_vars
}

module "iam" {
  source = "./modules/iam"

  lambda_role_name      = local.lambda_role_name
  logging_policy_name   = local.logging_policy_name
  publish_policy_name   = local.publish_policy_name
  log_group_name        = local.log_group_name
  sqs_queue_arn         = module.sqs.queue_arn
}

module "cloudwatch" {
  source = "./modules/cloudwatch"

  log_group_name = local.log_group_name
}

module "sqs" {
  source = "./modules/sqs"

  queue_name = local.queue_name
}
