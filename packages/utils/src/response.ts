/**
 * 成功レスポンスの型定義
 */
export interface SuccessResponse<T = any> {
  success: true
  data: T
  message?: string
}

/**
 * エラーレスポンスの型定義（error.tsから再エクスポート）
 */
export type { ErrorResponse } from './error'

/**
 * APIレスポンスの統一型
 */
export type ApiResponse<T = any> = SuccessResponse<T> | import('./error').ErrorResponse

/**
 * 成功レスポンスを作成
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string
): SuccessResponse<T> {
  return {
    success: true,
    data,
    message,
  }
}

/**
 * ページネーション情報を含むレスポンス
 */
export interface PaginatedResponse<T> extends SuccessResponse<T[]> {
  pagination: {
    page: number
    pageSize: number
    totalCount: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

/**
 * ページネーション付きレスポンスを作成
 */
export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  pageSize: number,
  totalCount: number
): PaginatedResponse<T> {
  const totalPages = Math.ceil(totalCount / pageSize)
  
  return {
    success: true,
    data,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  }
}

/**
 * Server Actionの結果型
 */
export type ActionResult<T = any> = 
  | { success: true; data: T; message?: string }
  | { success: false; error: string; code?: string }

/**
 * Server Action用の成功結果を作成
 */
export function actionSuccess<T>(data: T, message?: string): ActionResult<T> {
  return {
    success: true,
    data,
    message,
  }
}

/**
 * Server Action用のエラー結果を作成
 */
export function actionError(error: string, code?: string): ActionResult {
  return {
    success: false,
    error,
    code,
  }
}