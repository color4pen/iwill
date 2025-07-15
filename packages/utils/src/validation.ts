/**
 * バリデーションユーティリティ
 */

/**
 * メールアドレスの検証
 * @param email メールアドレス
 * @returns 有効なメールアドレスかどうか
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 電話番号の検証（日本の番号）
 * @param phone 電話番号
 * @returns 有効な電話番号かどうか
 */
export function isValidPhoneNumber(phone: string): boolean {
  // ハイフンを除去
  const cleaned = phone.replace(/-/g, '')
  // 日本の電話番号パターン（固定電話または携帯電話）
  const phoneRegex = /^(0[0-9]{1,4}-?[0-9]{1,4}-?[0-9]{4}|0[789]0-?[0-9]{4}-?[0-9]{4})$/
  return phoneRegex.test(cleaned)
}

/**
 * URLの検証
 * @param url URL文字列
 * @returns 有効なURLかどうか
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 文字列の最大長チェック
 * @param str 文字列
 * @param maxLength 最大長
 * @returns 最大長以内かどうか
 */
export function isWithinMaxLength(str: string, maxLength: number): boolean {
  return str.length <= maxLength
}

/**
 * 文字列の最小長チェック
 * @param str 文字列
 * @param minLength 最小長
 * @returns 最小長以上かどうか
 */
export function isWithinMinLength(str: string, minLength: number): boolean {
  return str.length >= minLength
}

/**
 * 必須項目のチェック
 * @param value 値
 * @returns 値が存在するかどうか
 */
export function isRequired(value: any): boolean {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return true
}

/**
 * 日付の範囲チェック
 * @param date チェックする日付
 * @param min 最小日付
 * @param max 最大日付
 * @returns 範囲内かどうか
 */
export function isDateInRange(date: Date, min?: Date, max?: Date): boolean {
  const targetTime = date.getTime()
  
  if (min && targetTime < min.getTime()) return false
  if (max && targetTime > max.getTime()) return false
  
  return true
}

/**
 * パスワードの強度チェック
 * @param password パスワード
 * @returns 強度（weak, medium, strong）
 */
export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  let strength = 0
  
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^a-zA-Z0-9]/.test(password)) strength++
  
  if (strength <= 2) return 'weak'
  if (strength <= 4) return 'medium'
  return 'strong'
}