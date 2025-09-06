import { webEnvSchema, validateEnv, type WebEnv } from './all'

/**
 * Webアプリの環境変数を取得
 */
export function getWebEnv(): WebEnv {
  return validateEnv(webEnvSchema)
}

// 互換性のために再エクスポート
export { webEnvSchema, type WebEnv } from './all'

// 環境変数をエクスポート（シングルトン）
export const webEnv = getWebEnv()