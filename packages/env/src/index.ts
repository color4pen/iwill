import { z } from 'zod'

/**
 * 環境変数のスキーマ定義
 */
const envSchema = z.object({
  // データベース
  DATABASE_URL: z.string().url('有効なデータベースURLを設定してください'),
  
  // NextAuth
  NEXTAUTH_URL: z.string().url('有効なNEXTAUTH_URLを設定してください').optional(),
  NEXTAUTH_SECRET: z.string().min(1, 'NEXTAUTH_SECRETを設定してください'),
  
  // LINE OAuth
  LINE_CLIENT_ID: z.string().min(1, 'LINE_CLIENT_IDを設定してください'),
  LINE_CLIENT_SECRET: z.string().min(1, 'LINE_CLIENT_SECRETを設定してください'),
  
  // アプリケーション設定
  WEDDING_DATE: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD形式で設定してください').optional(),
  
  // 環境
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // オプション
  VERCEL_URL: z.string().optional(),
})

/**
 * 環境変数の型定義
 */
export type Env = z.infer<typeof envSchema>

/**
 * 環境変数をバリデーションして取得
 * @returns バリデーション済みの環境変数
 */
export function getEnv(): Env {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('環境変数のバリデーションエラー:')
      error.errors.forEach((err) => {
        console.error(`- ${err.path.join('.')}: ${err.message}`)
      })
      throw new Error('環境変数の設定が不正です')
    }
    throw error
  }
}

/**
 * 環境変数を安全に取得するヘルパー関数
 */
export const env = new Proxy({} as Env, {
  get: (_target, prop: string) => {
    const env = getEnv()
    return env[prop as keyof Env]
  },
})

/**
 * 開発環境かどうかを判定
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

/**
 * 本番環境かどうかを判定
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

/**
 * テスト環境かどうかを判定
 */
export function isTest(): boolean {
  return process.env.NODE_ENV === 'test'
}

/**
 * ベースURLを取得
 */
export function getBaseUrl(): string {
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL
  }
  
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  
  return 'http://localhost:3000'
}

/**
 * 結婚式の日付を取得
 */
export function getWeddingDate(): Date | null {
  const weddingDate = process.env.WEDDING_DATE
  if (!weddingDate) return null
  
  const date = new Date(weddingDate)
  if (isNaN(date.getTime())) return null
  
  return date
}

/**
 * 結婚式当日かどうかを判定
 */
export function isWeddingDay(): boolean {
  const weddingDate = getWeddingDate()
  if (!weddingDate) return false
  
  const today = new Date()
  return (
    today.getFullYear() === weddingDate.getFullYear() &&
    today.getMonth() === weddingDate.getMonth() &&
    today.getDate() === weddingDate.getDate()
  )
}

/**
 * 結婚式前かどうかを判定
 */
export function isBeforeWedding(): boolean {
  const weddingDate = getWeddingDate()
  if (!weddingDate) return true
  
  return new Date() < weddingDate
}