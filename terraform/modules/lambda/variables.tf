// modules/lambda/variables.tf
variable "lambda_name" { type = string }
variable "role_arn"     { type = string }
variable "s3_bucket"    { type = string }
variable "s3_key"       { type = string }
variable "global_env_vars" { type = map(string) }

variable "environment_variables" {
  type = map(string)
}