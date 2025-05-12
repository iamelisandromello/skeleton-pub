variable "region" {
  default = "us-east-1"
}

variable "project_name" {
  description = "Name of the project derived from GitHub Repository name"
  type        = string
}
  
# =========================
# Variáveis de ambiente da Lambda
# =========================

variable "lambda_env_vars" {
  description = "Mapa de variáveis de ambiente para a função Lambda"
  type        = map(string)
  default     = {}
}

variable "s3_bucket_name" {
  description = "Nome do bucket S3 onde o artefato da Lambda será armazenado"
  type        = string
}