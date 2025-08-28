#!/bin/bash
#
# CDKスタックの出力値を.envファイルに自動反映するスクリプト
# 使用方法: ./scripts/update-env-from-cdk.sh [dev|prod]
#

set -e

# デフォルト値
ENV="${1:-dev}"
STACK_NAME="IwillMediaStack-${ENV}"
ENV_FILE=".env.local"
CDK_DIR="apps/cdk"

# 色付き出力
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔄 CDK出力値を取得中...${NC}"

# CDK出力をJSON形式で取得
cd "$CDK_DIR"
OUTPUTS=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --query 'Stacks[0].Outputs' \
  --output json 2>/dev/null || echo "[]")

if [ "$OUTPUTS" = "[]" ]; then
  echo -e "${RED}❌ スタック ${STACK_NAME} が見つかりません${NC}"
  echo -e "${YELLOW}💡 先に 'pnpm run cdk deploy --context env=${ENV}' を実行してください${NC}"
  exit 1
fi

cd ../..

# .envファイルのバックアップ
if [ -f "$ENV_FILE" ]; then
  cp "$ENV_FILE" "${ENV_FILE}.backup"
  echo -e "${GREEN}✅ ${ENV_FILE}.backup を作成しました${NC}"
fi

# 出力値をパース (互換性のある方法)
eval $(echo "$OUTPUTS" | jq -r '.[] | "export CDK_\(.OutputKey)=\"\(.OutputValue)\""')

# CDK管理セクションの開始マーカー
CDK_SECTION_START="# === CDK Managed Variables ==="
CDK_SECTION_END="# === End CDK Managed Variables ==="

# 既存の.envファイルからCDKセクション以外を抽出
if [ -f "$ENV_FILE" ]; then
  # CDKセクションの前の部分
  sed -n "1,/${CDK_SECTION_START}/p" "$ENV_FILE" | sed "/${CDK_SECTION_START}/d" > "${ENV_FILE}.tmp"
  
  # CDKセクションの後の部分
  if grep -q "$CDK_SECTION_END" "$ENV_FILE"; then
    sed -n "/${CDK_SECTION_END}/,\$p" "$ENV_FILE" | sed "/${CDK_SECTION_END}/d" >> "${ENV_FILE}.tmp"
  fi
else
  touch "${ENV_FILE}.tmp"
fi

# 新しいCDKセクションを追加
{
  echo "$CDK_SECTION_START"
  echo "# この下の変数はCDKによって自動管理されています"
  echo "# 手動で編集しないでください"
  echo "# 最終更新: $(date)"
  echo ""
  
  # 環境変数マッピング
  [ -n "${CDK_MediaBucketName}" ] && echo "AWS_S3_BUCKET_NAME=\"${CDK_MediaBucketName}\""
  [ -n "${CDK_MediaBucketArn}" ] && echo "AWS_S3_BUCKET_ARN=\"${CDK_MediaBucketArn}\""
  [ -n "${CDK_CloudFrontDistributionUrl}" ] && echo "AWS_CLOUDFRONT_URL=\"${CDK_CloudFrontDistributionUrl}\""
  [ -n "${CDK_CloudFrontDistributionId}" ] && echo "AWS_CLOUDFRONT_ID=\"${CDK_CloudFrontDistributionId}\""
  [ -n "${CDK_MediaUploadRoleArn}" ] && echo "AWS_MEDIA_UPLOAD_ROLE_ARN=\"${CDK_MediaUploadRoleArn}\""
  [ -n "${CDK_VercelOidcRoleArn}" ] && echo "AWS_ROLE_ARN=\"${CDK_VercelOidcRoleArn}\""
  [ -n "${CDK_Environment}" ] && echo "AWS_DEPLOYMENT_ENV=\"${CDK_Environment}\""
  echo "AWS_REGION=\"ap-northeast-1\""
  
  echo "$CDK_SECTION_END"
} >> "${ENV_FILE}.tmp"

# ファイルを置き換え
mv "${ENV_FILE}.tmp" "$ENV_FILE"

echo -e "${GREEN}✅ ${ENV_FILE} を更新しました${NC}"
echo ""
echo -e "${YELLOW}📝 更新された環境変数:${NC}"
[ -n "${CDK_MediaBucketName}" ] && echo "  AWS_S3_BUCKET_NAME=${CDK_MediaBucketName}"
[ -n "${CDK_CloudFrontDistributionUrl}" ] && echo "  AWS_CLOUDFRONT_URL=${CDK_CloudFrontDistributionUrl}"
[ -n "${CDK_VercelOidcRoleArn}" ] && echo "  AWS_ROLE_ARN=${CDK_VercelOidcRoleArn}"
echo "  AWS_REGION=ap-northeast-1"
echo ""
echo -e "${GREEN}✅ 完了！${NC}"