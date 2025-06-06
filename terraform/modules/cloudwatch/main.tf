#########################################
# main.tf (cloudwatch module)
#########################################

resource "aws_cloudwatch_log_group" "lambda_log_group" {
  name              = var.log_group_name
  retention_in_days = 14

  lifecycle {
    prevent_destroy     = true
    create_before_destroy = false
  }
}