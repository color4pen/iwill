/**
 * 日付フォーマットユーティリティ
 */

/**
 * 日付を日本語形式でフォーマット
 * @param date 日付
 * @param format フォーマット形式
 * @returns フォーマットされた日付文字列
 */
export function formatDate(date: Date | string, format: 'full' | 'date' | 'time' = 'full'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(d.getTime())) {
    return '無効な日付'
  }
  
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  const hours = d.getHours()
  const minutes = d.getMinutes()
  
  switch (format) {
    case 'date':
      return `${year}年${month}月${day}日`
    case 'time':
      return `${hours}:${minutes.toString().padStart(2, '0')}`
    case 'full':
    default:
      return `${year}年${month}月${day}日 ${hours}:${minutes.toString().padStart(2, '0')}`
  }
}

/**
 * 相対時間を取得
 * @param date 日付
 * @returns 相対時間文字列
 */
export function getRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 7) {
    return formatDate(d, 'date')
  } else if (days > 0) {
    return `${days}日前`
  } else if (hours > 0) {
    return `${hours}時間前`
  } else if (minutes > 0) {
    return `${minutes}分前`
  } else {
    return 'たった今'
  }
}

/**
 * 数値を3桁カンマ区切りでフォーマット
 * @param num 数値
 * @returns フォーマットされた文字列
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('ja-JP')
}

/**
 * ファイルサイズをフォーマット
 * @param bytes バイト数
 * @returns フォーマットされたサイズ
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}