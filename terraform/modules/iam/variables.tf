// modules/iam/variables.tf
variable "lambda_role_name"    { type = string }
variable "logging_policy_name" { type = string }
variable "publish_policy_name" { type = string }
variable "sqs_queue_arn"       { type = string }