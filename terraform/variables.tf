variable "region" {
  default = "us-east-1"
}

variable "project_name" {
  description = "Name of the project derived from GitHub Repository name"
  type        = string
}
