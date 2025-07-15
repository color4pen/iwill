/**
 * 問い合わせカテゴリーのラベル
 */
export const INQUIRY_CATEGORY_LABELS = {
  GENERAL: "一般",
  ATTENDANCE: "出欠",
  VENUE: "会場",
  GIFT: "ご祝儀",
  OTHER: "その他"
} as const

/**
 * 問い合わせステータスのラベル
 */
export const INQUIRY_STATUS_LABELS = {
  OPEN: "対応中",
  RESOLVED: "解決済み",
  CLOSED: "クローズ"
} as const

/**
 * 問い合わせステータスの色
 */
export const INQUIRY_STATUS_COLORS = {
  OPEN: "bg-blue-100 text-blue-800",
  RESOLVED: "bg-green-100 text-green-800",
  CLOSED: "bg-gray-100 text-gray-800"
} as const

/**
 * 通知カテゴリーのラベル
 */
export const NOTIFICATION_CATEGORY_LABELS = {
  GENERAL: "一般",
  SCHEDULE: "スケジュール",
  VENUE: "会場",
  IMPORTANT: "重要"
} as const

/**
 * 優先度のラベル
 */
export const PRIORITY_LABELS = {
  LOW: "低",
  NORMAL: "通常",
  HIGH: "高",
  URGENT: "緊急"
} as const

/**
 * 優先度の色
 */
export const PRIORITY_COLORS = {
  LOW: "bg-gray-100 text-gray-800",
  NORMAL: "bg-blue-100 text-blue-800",
  HIGH: "bg-yellow-100 text-yellow-800",
  URGENT: "bg-red-100 text-red-800"
} as const

/**
 * 出欠ステータスのラベル
 */
export const ATTENDANCE_STATUS_LABELS = {
  ATTENDING: "出席",
  NOT_ATTENDING: "欠席",
  UNDECIDED: "未定"
} as const

/**
 * ユーザーロールのラベル
 */
export const USER_ROLE_LABELS = {
  USER: "ゲスト",
  ADMIN: "管理者"
} as const