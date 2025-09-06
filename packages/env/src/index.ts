import { envSchema, validateEnv, type Env } from './all'

/**
 * 環境変数をバリデーションして取得
 * @returns バリデーション済みの環境変数
 */
export function getEnv(): Env {
  return validateEnv(envSchema)
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

// 環境変数の型と検証関数をエクスポート
export { 
  envSchema, 
  webEnvSchema, 
  adminEnvSchema,
  cdkEnvSchema,
  validateEnv,
  type Env,
  type WebEnv,
  type AdminEnv,
  type CdkEnv
} from './all'

// 個別のアプリケーション用のエクスポート
export { getWebEnv, webEnv } from './web'
export { getAdminEnv, adminEnv } from './admin'