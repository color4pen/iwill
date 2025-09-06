import { adminEnvSchema, validateEnv, type AdminEnv } from './all'

/**
 * Adminアプリの環境変数を取得
 */
export function getAdminEnv(): AdminEnv {
  return validateEnv(adminEnvSchema)
}

// 互換性のために再エクスポート
export { adminEnvSchema, type AdminEnv } from './all'

// 環境変数をエクスポート（シングルトン）
export const adminEnv = getAdminEnv()