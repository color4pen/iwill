/**
 * APIレスポンスの基本型
 */
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  message?: string
}

/**
 * ページネーション情報
 */
export interface PaginationInfo {
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

/**
 * ページネーション付きレスポンス
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationInfo
}

/**
 * Server Actionの結果型
 */
export type ActionResult<T = any> = 
  | { success: true; data: T; message?: string }
  | { success: false; error: string; code?: string }

/**
 * ソート順序
 */
export type SortOrder = 'asc' | 'desc'

/**
 * 共通のクエリパラメータ
 */
export interface CommonQueryParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: SortOrder
  search?: string
}