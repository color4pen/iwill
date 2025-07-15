import { ActionResult } from '@repo/types'

/**
 * Server Actionのエラーハンドリングラッパー
 * @param action 実行する非同期関数
 * @returns ActionResult形式の結果
 */
export async function handleServerAction<T>(
  action: () => Promise<T>
): Promise<ActionResult<T>> {
  try {
    const data = await action()
    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error('Server action error:', error)
    
    // Prismaエラーのハンドリング
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as any
      
      // よくあるPrismaエラーのマッピング
      const errorMessages: Record<string, string> = {
        'P2002': 'このデータは既に存在します',
        'P2003': '関連するデータが見つかりません',
        'P2025': '指定されたレコードが見つかりません',
        'P2014': '関連するレコードがあるため削除できません',
      }
      
      const message = errorMessages[prismaError.code] || prismaError.message || 'データベースエラーが発生しました'
      
      return {
        success: false,
        error: message,
        code: prismaError.code,
      }
    }
    
    // 一般的なエラー
    const message = error instanceof Error ? error.message : '予期しないエラーが発生しました'
    
    return {
      success: false,
      error: message,
    }
  }
}

/**
 * 認証が必要なServer Actionのラッパー
 * @param action 実行する非同期関数（セッション情報を受け取る）
 * @param getSession セッション取得関数
 * @returns ActionResult形式の結果
 */
export async function handleAuthenticatedAction<T>(
  action: (session: any) => Promise<T>,
  getSession: () => Promise<any>
): Promise<ActionResult<T>> {
  try {
    const session = await getSession()
    
    if (!session?.user?.id) {
      return {
        success: false,
        error: '認証が必要です',
        code: 'UNAUTHORIZED',
      }
    }
    
    const data = await action(session)
    return {
      success: true,
      data,
    }
  } catch (error) {
    return handleServerAction(async () => {
      throw error
    })
  }
}

/**
 * バリデーション付きServer Actionのラッパー
 * @param action 実行する非同期関数
 * @param validate バリデーション関数
 * @returns ActionResult形式の結果
 */
export async function handleValidatedAction<T, V>(
  action: (validatedData: V) => Promise<T>,
  validate: () => V | Promise<V>
): Promise<ActionResult<T>> {
  try {
    const validatedData = await validate()
    return handleServerAction(() => action(validatedData))
  } catch (error) {
    // バリデーションエラー
    if (error instanceof Error) {
      return {
        success: false,
        error: `入力エラー: ${error.message}`,
        code: 'VALIDATION_ERROR',
      }
    }
    
    return {
      success: false,
      error: '入力値が不正です',
      code: 'VALIDATION_ERROR',
    }
  }
}