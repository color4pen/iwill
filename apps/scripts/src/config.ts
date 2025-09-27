import { getWebEnv } from "@repo/env"

// 環境変数の設定（webアプリと同じ環境変数を使用）
const env = getWebEnv()

export const config = {
  AWS_S3_BUCKET_NAME: env.AWS_S3_BUCKET_NAME,
  AWS_CLOUDFRONT_URL: env.AWS_CLOUDFRONT_URL,
  AWS_REGION: env.AWS_REGION,
  DATABASE_URL: env.DATABASE_URL,
}