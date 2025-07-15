/**
 * カスタムエラークラス
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message)
    this.name = 'AppError'
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * よく使用されるエラータイプ
 */
export const ErrorTypes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  DATABASE_ERROR: 'DATABASE_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
} as const

/**
 * エラーレスポンスの型定義
 */
export interface ErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: any
  }
}

/**
 * エラーをログに記録する
 */
export function logError(error: unknown, context?: Record<string, any>): void {
  if (error instanceof AppError) {
    console.error(`[${error.code}] ${error.message}`, {
      statusCode: error.statusCode,
      details: error.details,
      context,
      stack: error.stack,
    })
  } else if (error instanceof Error) {
    console.error(`[UNKNOWN_ERROR] ${error.message}`, {
      context,
      stack: error.stack,
    })
  } else {
    console.error('[UNKNOWN_ERROR] An unknown error occurred', {
      error,
      context,
    })
  }
}

/**
 * エラーをユーザーフレンドリーなメッセージに変換
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message
  } else if (error instanceof Error) {
    // 本番環境では詳細なエラーメッセージを隠す
    if (process.env.NODE_ENV === 'production') {
      return 'エラーが発生しました。しばらくしてからもう一度お試しください。'
    }
    return error.message
  }
  return 'エラーが発生しました。しばらくしてからもう一度お試しください。'
}

/**
 * エラーをErrorResponseに変換
 */
export function createErrorResponse(error: unknown): ErrorResponse {
  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    }
  }

  logError(error)
  
  return {
    success: false,
    error: {
      code: ErrorTypes.INTERNAL_ERROR,
      message: getErrorMessage(error),
    },
  }
}

/**
 * Prismaエラーを処理する
 */
export function handlePrismaError(error: any): AppError {
  // Prismaの一般的なエラーコード
  switch (error.code) {
    case 'P2002':
      return new AppError(
        'データが既に存在します',
        ErrorTypes.VALIDATION_ERROR,
        400,
        { field: error.meta?.target }
      )
    case 'P2025':
      return new AppError(
        'データが見つかりません',
        ErrorTypes.NOT_FOUND,
        404
      )
    case 'P2003':
      return new AppError(
        '関連データが見つかりません',
        ErrorTypes.VALIDATION_ERROR,
        400
      )
    default:
      return new AppError(
        'データベースエラーが発生しました',
        ErrorTypes.DATABASE_ERROR,
        500,
        { code: error.code }
      )
  }
}