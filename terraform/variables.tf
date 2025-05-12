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

variable "global_env_vars" {
  description = "Mapa de ambientes com suas respectivas variáveis de ambiente para a Lambda"
  type        = map(map(string))
}

variable "environments" {
  type        = map(string)
  description = "Ambiente (dev, prod, preview, etc.)"
  default     = {}
}

variable "s3_bucket_name" {
  description = "Nome do bucket S3 onde o artefato da Lambda será armazenado"
  type        = string
}
