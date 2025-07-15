import { z } from 'zod'
import { baseEnvSchema, validateEnv } from './base'

/**
 * Adminアプリ用の環境変数スキーマ
 */
const adminEnvSchema = baseEnvSchema.extend({
  // Admin specific
  ADMIN_EMAIL_WHITELIST: z.string().optional(), // カンマ区切りのメールアドレスリスト
  
  // Features
  ENABLE_USER_MANAGEMENT: z.enum(['true', 'false']).transform(val => val === 'true').default('true'),
  ENABLE_ANALYTICS: z.enum(['true', 'false']).transform(val => val === 'true').default('false'),
})

export type AdminEnv = z.infer<typeof adminEnvSchema>

/**
 * Adminアプリの環境変数を取得
 */
export function getAdminEnv(): AdminEnv {
  return validateEnv(adminEnvSchema)
}

// 環境変数をエクスポート（シングルトン）
export const adminEnv = getAdminEnv()