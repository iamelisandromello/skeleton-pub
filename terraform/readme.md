# 📐 Documentação da Infraestrutura Terraform

Este repositório utiliza o Terraform para provisionar e gerenciar a infraestrutura de funções AWS Lambda, SQS, IAM Roles, CloudWatch Log Groups e armazenamento em S3, com suporte a ambientes dinâmicos e reutilizáveis via módulos.

---

## 📁 Estrutura dos Arquivos

```bash
terraform/
├── main.tf
├── variables.tf
├── outputs.tf
├── backend.tf
├── lambda/
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
├── sqs/
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
├── iam/
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
├── cloudwatch/
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
```

---

## 🧱 Módulos

### `lambda/`
Responsável pela definição da função Lambda:
- Configuração do runtime, handler e source code
- Referência ao bucket S3 compartilhado (via `data.aws_s3_bucket`)
- Associação com IAM Role

### `sqs/`
Define a fila SQS associada à função Lambda:
- Nome customizável via variáveis
- Criação condicional baseada no nome e ambiente

### `iam/`
Gerencia as permissões da Lambda:
- Criação da IAM Role com trust policy para Lambda
- Policies inline para logs e publicação em SQS

### `cloudwatch/`
Cria o log group da Lambda:
- Nomeado conforme padrão `/aws/lambda/<nome-da-função>`
- Retenção configurável (default: 7 dias)

---

## ⚙️ Integração com GitHub Actions

Os recursos AWS existentes são importados dinamicamente pelo workflow `import-resources` antes do `terraform apply`.

### 📍 Localização do script de import:
```
.github/actions/import-resources/scripts/import.sh
```

### Recursos importados automaticamente se existirem:
- SQS Queue
- IAM Role + policies
- CloudWatch Log Group
- Função Lambda

---

## 📦 Variáveis Relevantes

As variáveis globais estão centralizadas nos módulos e incluem:

```hcl
variable "environment" {}             # Ambiente (ex: dev, staging, prod)
variable "project_name" {}            # Nome base do projeto
variable "s3_bucket_name" {}          # Bucket S3 onde o .zip da Lambda é armazenado
variable "lambda_role_name" {}        # Nome da IAM Role da Lambda
variable "logging_policy_name" {}     # Nome da policy de logs
variable "publish_policy_name" {}     # Nome da policy para publicar na SQS
variable "sqs_queue_arn" {}           # ARN da fila SQS
```

---

## 📤 Outputs

Cada módulo expõe outputs úteis para integração e debug:

| Módulo       | Output            | Descrição                                  |
|--------------|-------------------|--------------------------------------------|
| `lambda`     | `function_arn`    | ARN da Lambda criada ou importada          |
| `iam`        | `role_arn`        | ARN da IAM Role da função Lambda           |
| `sqs`        | `queue_url`       | URL da fila SQS criada ou existente        |
| `cloudwatch` | `log_group_name`  | Nome do Log Group                          |

---

## ✅ Boas Práticas

- Módulos isolados favorecem reuso e manutenibilidade.
- Recursos AWS existentes são importados automaticamente via CI.
- As variáveis são passadas exclusivamente como `TF_VAR_` para segurança e flexibilidade.
- Ações GitHub são compostas e reutilizáveis com `inputs` explícitos.

---

## 📚 Sugestões Futuras

- Adicionar `lifecycle` com `prevent_destroy` para recursos sensíveis (IAM, SQS).
- Versionar os módulos como `terraform-modules/<vX>` com `source = ../terraform-modules//iam?ref=v1`.
- Criar validação automática de `tfvars.json` com JSON Schema no CI.
