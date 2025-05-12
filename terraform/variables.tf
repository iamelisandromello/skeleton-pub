variable "region" {
  default = "us-east-1"
}

variable "project_name" {
  description = "Name of the project derived from GitHub Repository name"
  type        = string
}

variable "environment" {
  description = "Nome do ambiente (ex: dev, prod, preview)"
  type        = string
}
  
# =========================
# Variáveis de ambiente da Lambda
# =========================

variable "global_env_vars" {
  description = "Mapa de ambientes com suas respectivas variáveis de ambiente para a Lambda"
  type        = map(string)
}

variable "environments" {
  description = "Ambiente (dev, prod, preview, etc.)"
  type = map(object({
    LOG_LEVEL = string
    DB_HOST   = string
    DB_NAME   = string
  }))
}

variable "s3_bucket_name" {
  description = "Nome do bucket S3 onde o artefato da Lambda será armazenado"
  type        = string
}
