#!/bin/bash
set -e

echo "🔧 DEBUG VARIÁVEIS DE AMBIENTE"
echo "ENVIRONMENT=${ENVIRONMENT}"
echo "PROJECT_NAME=${PROJECT_NAME}"
echo "AWS_REGION=${AWS_REGION}"
echo "AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID:0:4}********"

# Navegar até o diretório terraform na raiz do repositório
cd "$GITHUB_WORKSPACE/terraform" || {
  echo "❌ Diretório terraform/ não encontrado em $GITHUB_WORKSPACE"
  exit 1
}

# Determinar nomes com base no ambiente
if [ "$ENVIRONMENT" = "prod" ]; then
  LAMBDA_NAME="${PROJECT_NAME}"
  ENV_SUFFIX=""
else
  LAMBDA_NAME="${PROJECT_NAME}-${ENVIRONMENT}"
  ENV_SUFFIX="-${ENVIRONMENT}"
fi

QUEUE_NAME="${LAMBDA_NAME}-queue"
ROLE_NAME="${PROJECT_NAME}${ENV_SUFFIX}_execution_role"
LOG_GROUP_NAME="/aws/lambda/${LAMBDA_NAME}"

set +e

echo "🔍 Verificando SQS '$QUEUE_NAME'..."
if QUEUE_URL=$(aws sqs get-queue-url --queue-name "$QUEUE_NAME" --region "$AWS_REGION" --query 'QueueUrl' --output text 2>/dev/null); then
  terraform import aws_sqs_queue.my_queue "$QUEUE_URL" && echo "🟢 SQS importada com sucesso." || {
    echo "⚠️ Falha ao importar a SQS."; exit 1;
  }
else
  echo "🛠️ SQS '$QUEUE_NAME' não encontrada. Terraform irá criá-la."
fi

echo "🟢 Bucket S3 tratado como data source."

echo "🔍 Verificando IAM Role '$ROLE_NAME'..."
if aws iam get-role --role-name "$ROLE_NAME" --region "$AWS_REGION" &>/dev/null; then
  terraform import aws_iam_role.lambda_execution_role "$ROLE_NAME" && echo "🟢 IAM Role importada com sucesso." || {
    echo "⚠️ Falha ao importar a IAM Role."; exit 1;
  }
else
  echo "🛠️ IAM Role não encontrada. Terraform irá criá-la."
fi

echo "🔍 Verificando Log Group '$LOG_GROUP_NAME'..."
if aws logs describe-log-groups --log-group-name-prefix "$LOG_GROUP_NAME" --region "$AWS_REGION" | grep "$LOG_GROUP_NAME" &>/dev/null; then
  terraform state list | grep aws_cloudwatch_log_group.lambda_log_group >/dev/null && \
    echo "ℹ️ Log Group já está no state." || {
      terraform import aws_cloudwatch_log_group.lambda_log_group "$LOG_GROUP_NAME" && echo "🟢 Log Group importado com sucesso." || {
        echo "⚠️ Falha ao importar o Log Group."; exit 1;
      }
  }
else
  echo "🛠️ Log Group não encontrado. Terraform irá criá-lo."
fi

echo "🔍 Verificando Lambda '$LAMBDA_NAME'..."
if aws lambda get-function --function-name "$LAMBDA_NAME" --region "$AWS_REGION" &>/dev/null; then
  terraform import aws_lambda_function.my_lambda_function "$LAMBDA_NAME" && echo "🟢 Lambda importada com sucesso." || {
    echo "⚠️ Falha ao importar a Lambda."; exit 1;
  }
else
  echo "🛠️ Lambda '$LAMBDA_NAME' não encontrada. Terraform irá criá-la."
fi
