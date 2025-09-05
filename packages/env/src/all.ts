import { z } from 'zod'

/**
 * すべての環境変数の定義を一元管理
 * このファイルが環境変数の唯一の真実の源（Single Source of Truth）となります
 */

// ============================================
// 基本設定
// ============================================
const coreSchema = z.object({
  // Node.js
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
})

// ============================================
// データベース
// ============================================
const databaseSchema = z.object({
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
})

// ============================================
// 認証 (NextAuth)
// ============================================
const authSchema = z.object({
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL').optional(),
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
})

// ============================================
// LINE OAuth
// ============================================
const lineSchema = z.object({
  LINE_CLIENT_ID: z.string().min(1, 'LINE_CLIENT_ID is required'),
  LINE_CLIENT_SECRET: z.string().min(1, 'LINE_CLIENT_SECRET is required'),
})

// ============================================
// AWS設定
// ============================================
const awsSchema = z.object({
  // S3
  AWS_S3_BUCKET_NAME: z.string().optional(),
  AWS_S3_BUCKET_ARN: z.string().optional(),
  
  // CloudFront
  AWS_CLOUDFRONT_URL: z.string().url().optional(),
  AWS_CLOUDFRONT_ID: z.string().optional(),
  
  // IAM
  AWS_MEDIA_UPLOAD_ROLE_ARN: z.string().optional(),
  AWS_ROLE_ARN: z.string().optional(),
  
  // General
  AWS_DEPLOYMENT_ENV: z.string().optional(),
  AWS_REGION: z.string().default('ap-northeast-1'),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_SESSION_TOKEN: z.string().optional(),
})

// ============================================
// Vercel設定
// ============================================
const vercelSchema = z.object({
  VERCEL: z.string().optional(),
  VERCEL_ENV: z.enum(['development', 'preview', 'production']).optional(),
  VERCEL_URL: z.string().optional(),
  VERCEL_BRANCH_URL: z.string().optional(),
  VERCEL_REGION: z.string().optional(),
  VERCEL_GIT_PROVIDER: z.string().optional(),
  VERCEL_GIT_REPO_SLUG: z.string().optional(),
  VERCEL_GIT_REPO_OWNER: z.string().optional(),
  VERCEL_GIT_REPO_ID: z.string().optional(),
  VERCEL_GIT_COMMIT_REF: z.string().optional(),
  VERCEL_GIT_COMMIT_SHA: z.string().optional(),
  VERCEL_GIT_COMMIT_MESSAGE: z.string().optional(),
  VERCEL_GIT_COMMIT_AUTHOR_LOGIN: z.string().optional(),
  VERCEL_GIT_COMMIT_AUTHOR_NAME: z.string().optional(),
})

// ============================================
// CDK設定
// ============================================
const cdkSchema = z.object({
  CDK_DEFAULT_ACCOUNT: z.string().optional(),
  CDK_DEFAULT_REGION: z.string().optional(),
})

// ============================================
// アプリケーション機能フラグ
// ============================================
const featuresSchema = z.object({
  // Web app features
  ENABLE_GALLERY: z.enum(['true', 'false']).transform(val => val === 'true').default('true'),
  ENABLE_INQUIRIES: z.enum(['true', 'false']).transform(val => val === 'true').default('true'),
  
  // Admin app features
  ENABLE_USER_MANAGEMENT: z.enum(['true', 'false']).transform(val => val === 'true').default('true'),
  ENABLE_ANALYTICS: z.enum(['true', 'false']).transform(val => val === 'true').default('false'),
  
  // Admin specific
  ADMIN_EMAIL_WHITELIST: z.string().optional(), // カンマ区切りのメールアドレスリスト
})

// ============================================
// 統合スキーマ
// ============================================

/**
 * すべての環境変数を含む完全なスキーマ
 */
export const envSchema = z.object({
  ...coreSchema.shape,
  ...databaseSchema.shape,
  ...authSchema.shape,
  ...lineSchema.shape,
  ...awsSchema.shape,
  ...vercelSchema.shape,
  ...cdkSchema.shape,
  ...featuresSchema.shape,
})

/**
 * Web用環境変数のスキーマ（必要な項目のみ）
 */
export const webEnvSchema = z.object({
  // Core
  NODE_ENV: coreSchema.shape.NODE_ENV,
  
  // Database
  DATABASE_URL: databaseSchema.shape.DATABASE_URL,
  
  // Auth
  NEXTAUTH_URL: authSchema.shape.NEXTAUTH_URL,
  NEXTAUTH_SECRET: authSchema.shape.NEXTAUTH_SECRET,
  
  // LINE
  LINE_CLIENT_ID: lineSchema.shape.LINE_CLIENT_ID,
  LINE_CLIENT_SECRET: lineSchema.shape.LINE_CLIENT_SECRET,
  
  // AWS (media upload)
  AWS_S3_BUCKET_NAME: awsSchema.shape.AWS_S3_BUCKET_NAME,
  AWS_CLOUDFRONT_URL: awsSchema.shape.AWS_CLOUDFRONT_URL,
  AWS_REGION: awsSchema.shape.AWS_REGION,
  AWS_ROLE_ARN: awsSchema.shape.AWS_ROLE_ARN,
  AWS_ACCESS_KEY_ID: awsSchema.shape.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: awsSchema.shape.AWS_SECRET_ACCESS_KEY,
  AWS_SESSION_TOKEN: awsSchema.shape.AWS_SESSION_TOKEN,
  
  // Vercel
  VERCEL: vercelSchema.shape.VERCEL,
  VERCEL_ENV: vercelSchema.shape.VERCEL_ENV,
  VERCEL_URL: vercelSchema.shape.VERCEL_URL,
  VERCEL_BRANCH_URL: vercelSchema.shape.VERCEL_BRANCH_URL,
  
  // Features
  ENABLE_GALLERY: featuresSchema.shape.ENABLE_GALLERY,
  ENABLE_INQUIRIES: featuresSchema.shape.ENABLE_INQUIRIES,
})

/**
 * Admin用環境変数のスキーマ（必要な項目のみ）
 */
export const adminEnvSchema = z.object({
  // Core
  NODE_ENV: coreSchema.shape.NODE_ENV,
  
  // Database
  DATABASE_URL: databaseSchema.shape.DATABASE_URL,
  
  // Auth
  NEXTAUTH_URL: authSchema.shape.NEXTAUTH_URL,
  NEXTAUTH_SECRET: authSchema.shape.NEXTAUTH_SECRET,
  
  // LINE
  LINE_CLIENT_ID: lineSchema.shape.LINE_CLIENT_ID,
  LINE_CLIENT_SECRET: lineSchema.shape.LINE_CLIENT_SECRET,
  
  // Features
  ENABLE_USER_MANAGEMENT: featuresSchema.shape.ENABLE_USER_MANAGEMENT,
  ENABLE_ANALYTICS: featuresSchema.shape.ENABLE_ANALYTICS,
  ADMIN_EMAIL_WHITELIST: featuresSchema.shape.ADMIN_EMAIL_WHITELIST,
})

/**
 * CDK用環境変数のスキーマ
 */
export const cdkEnvSchema = z.object({
  ...coreSchema.shape,
  ...awsSchema.shape,
  ...cdkSchema.shape,
})

// 型定義のエクスポート
export type Env = z.infer<typeof envSchema>
export type WebEnv = z.infer<typeof webEnvSchema>
export type AdminEnv = z.infer<typeof adminEnvSchema>
export type CdkEnv = z.infer<typeof cdkEnvSchema>

/**
 * 環境変数を検証する汎用関数
 */
export function validateEnv<T extends z.ZodTypeAny>(
  schema: T,
  env: NodeJS.ProcessEnv = process.env
): z.infer<T> {
  try {
    return schema.parse(env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:')
      const errors = error.flatten().fieldErrors
      Object.entries(errors).forEach(([field, messages]) => {
        console.error(`  ${field}: ${messages?.join(', ')}`)
      })
      throw new Error('Invalid environment variables')
    }
    throw error
  }
}