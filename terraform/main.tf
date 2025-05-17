#########################################
# main.tf (root module)
#########################################

terraform {
  required_version = ">= 1.0.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 4.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

data "aws_s3_bucket" "lambda_code_bucket" {
  bucket = var.s3_bucket_name
}

module "sqs" {
  source     = "./modules/sqs"
  queue_name = local.queue_name
}

module "lambda" {
  source             = "./modules/lambda"
  function_name      = local.lambda_name
  s3_bucket          = data.aws_s3_bucket.lambda_code_bucket.bucket
  s3_key             = local.lambda_package_key
  handler            = local.lambda_handler
  runtime            = local.lambda_runtime
  role_arn           = module.iam.lambda_role_arn
  environment        = var.environment
}

module "iam" {
  source = "./modules/iam"
  project_name = var.project_name
  environment  = var.environment
}

module "cloudwatch" {
  source         = "./modules/cloudwatch"
  log_group_name = local.log_group_name
}

locals {
  lambda_name         = var.environment == "prod" ? var.project_name : "${var.project_name}-${var.environment}"
  queue_name          = "${local.lambda_name}-queue"
  log_group_name      = "/aws/lambda/${local.lambda_name}"
  lambda_package_key  = "${local.lambda_name}/lambda.zip"
  lambda_handler      = "index.handler"
  lambda_runtime      = "nodejs18.x"
}