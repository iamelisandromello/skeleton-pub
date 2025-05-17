#!/bin/bash
set -e

echo "🔧 DEBUG VARIÁVEIS DE AMBIENTE"
echo "ENVIRONMENT=${ENVIRONMENT}"
echo "PROJECT_NAME=${PROJECT_NAME}"
echo "S3_BUCKET_NAME=${S3_BUCKET_NAME}"
echo "AWS_REGION=${AWS_REGION}"
echo "AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID:0:4}********"

# ✅ Exporta variáveis como TF_VAR para o Terraform
export TF_VAR_environment="$ENVIRONMENT"
export TF_VAR_project_name="$PROJECT_NAME"
export TF_VAR_s3_bucket_name="$S3_BUCKET_NAME"

echo "📦 TF_VARs disponíveis para o Terraform:"
env | grep TF_VAR_

cd "$GITHUB_WORKSPACE/terraform" || {
  echo "❌ Diretório terraform/ não encontrado em $GITHUB_WORKSPACE"
  exit 1
}

# 🔄 Construção dos nomes reais com base no padrão de seus locals
if [ "$ENVIRONMENT" = "prod" ]; then
  LAMBDA_NAME="${PROJECT_NAME}"
  ROLE_NAME="${PROJECT_NAME}_execution_role"
  LOGGING_POLICY_NAME="${PROJECT_NAME}_logging_policy"
  PUBLISH_POLICY_NAME="${PROJECT_NAME}-lambda-sqs-publish"
else
  LAMBDA_NAME="${PROJECT_NAME}-${ENVIRONMENT}"
  ROLE_NAME="${PROJECT_NAME}-${ENVIRONMENT}_execution_role"
  LOGGING_POLICY_NAME="${PROJECT_NAME}-${ENVIRONMENT}_logging_policy"
  PUBLISH_POLICY_NAME="${PROJECT_NAME}-${ENVIRONMENT}-lambda-sqs-publish"
fi

QUEUE_NAME="${LAMBDA_NAME}-queue"
LOG_GROUP_NAME="/aws/lambda/${LAMBDA_NAME}"

set +e

# ✅ Importa SQS se existir
echo "🔍 Verificando SQS '$QUEUE_NAME'..."
if QUEUE_URL=$(aws sqs get-queue-url --queue-name "$QUEUE_NAME" --region "$AWS_REGION" --query 'QueueUrl' --output text 2>/dev/null); then
  terraform import "module.sqs.aws_sqs_queue.queue" "$QUEUE_URL" && echo "🟢 SQS importada com sucesso." || {
    echo "⚠️ Falha ao importar a SQS."; exit 1;
  }
else
  echo "🛠️ SQS '$QUEUE_NAME' não encontrada. Terraform irá criá-la."
fi

# ✅ Verifica existência do Bucket S3 fornecido via TF_VAR_s3_bucket_name
echo "🔍 Verificando Bucket '$S3_BUCKET_NAME'..."
if aws s3api head-bucket --bucket "$S3_BUCKET_NAME" --region "$AWS_REGION" 2>/dev/null; then
  echo "🟢 Bucket S3 '$S3_BUCKET_NAME' existe. Referência como 'data.aws_s3_bucket.lambda_code_bucket'."
else
  echo "❌ Bucket S3 '$S3_BUCKET_NAME' NÃO encontrado. Verifique se o nome está correto e acessível."
  exit 1
fi

# ✅ Importa IAM Role se existir
echo "🔍 Verificando IAM Role '$ROLE_NAME'..."
if aws iam get-role --role-name "$ROLE_NAME" --region "$AWS_REGION" &>/dev/null; then
  terraform import "module.iam.aws_iam_role.lambda_execution_role" "$ROLE_NAME" && echo "🟢 IAM Role importada com sucesso." || {
    echo "⚠️ Falha ao importar a IAM Role."; exit 1;
  }
else
  echo "🛠️ IAM Role '$ROLE_NAME' não encontrada. Terraform irá criá-la."
fi

# ✅ Importa Log Group se existir (corrigido para o módulo cloudwatch)
echo "🔍 Verificando Log Group '$LOG_GROUP_NAME'..."
if aws logs describe-log-groups --log-group-name-prefix "$LOG_GROUP_NAME" --region "$AWS_REGION" | grep "$LOG_GROUP_NAME" &>/dev/null; then
  terraform state list | grep module.cloudwatch.aws_cloudwatch_log_group.lambda_log_group >/dev/null && \
    echo "ℹ️ Log Group já está no state." || {
      terraform import "module.cloudwatch.aws_cloudwatch_log_group.lambda_log_group" "$LOG_GROUP_NAME" && echo "🟢 Log Group importado com sucesso." || {
        echo "⚠️ Falha ao importar o Log Group."; exit 1;
      }
  }
else
  echo "🛠️ Log Group '$LOG_GROUP_NAME' não encontrado. Terraform irá criá-lo."
fi

# ✅ Importa Lambda Function se existir
echo "🔍 Verificando Lambda '$LAMBDA_NAME'..."
if aws lambda get-function --function-name "$LAMBDA_NAME" --region "$AWS_REGION" &>/dev/null; then
  terraform import "module.lambda.aws_lambda_function.lambda" "$LAMBDA_NAME" && echo "🟢 Lambda importada com sucesso." || {
    echo "⚠️ Falha ao importar a Lambda."; exit 1;
  }
else
  echo "🛠️ Lambda '$LAMBDA_NAME' não encontrada. Terraform irá criá-la."
fi
