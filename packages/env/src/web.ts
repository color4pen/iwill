import { z } from 'zod'
import { baseEnvSchema, validateEnv } from './base'

/**
 * Webアプリ用の環境変数スキーマ
 */
const webEnvSchema = baseEnvSchema.extend({
  // Optional features
  ENABLE_GALLERY: z.enum(['true', 'false']).transform(val => val === 'true').default('true'),
  ENABLE_INQUIRIES: z.enum(['true', 'false']).transform(val => val === 'true').default('true'),
})

export type WebEnv = z.infer<typeof webEnvSchema>

/**
 * Webアプリの環境変数を取得
 */
export function getWebEnv(): WebEnv {
  return validateEnv(webEnvSchema)
}

// 環境変数をエクスポート（シングルトン）
export const webEnv = getWebEnv()