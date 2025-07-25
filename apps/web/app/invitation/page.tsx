"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { useSession, signOut } from "next-auth/react"
import { acceptInvitation } from "./actions"
import { paths } from "@/lib/paths"

function InvitationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [redirectTimer, setRedirectTimer] = useState<NodeJS.Timeout | null>(null)
  
  const token = searchParams.get("token")
  const lineId = session?.user?.id || searchParams.get("lineId")
  const name = session?.user?.name || searchParams.get("name")
  const email = session?.user?.email || searchParams.get("email")
  const image = session?.user?.image || searchParams.get("image")

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (redirectTimer) {
        clearTimeout(redirectTimer)
      }
    }
  }, [redirectTimer])

  useEffect(() => {
    // セッションの読み込みが完了していない場合は待つ
    if (status === "loading") {
      return
    }

    // 既にログイン済みの既存ユーザーの場合は即座にホームへ
    if (status === "authenticated" && session?.user && session.user.id !== session.user.lineId) {
      router.push(paths.home)
      return
    }

    if (!token) {
      setError("無効な招待URLです")
      return
    }

    // 未認証の場合は、招待トークンを持ってログインページへリダイレクト
    if (status === "unauthenticated") {
      router.push(`${paths.login}?invitation=${token}`)
      return
    }

    // 既にログイン済みの場合
    if (status === "authenticated" && session?.user) {
      // 既存ユーザーかチェック（DBのユーザーIDとLINE IDが異なる = 既存ユーザー）
      if (lineId && session.user.id !== session.user.lineId) {
        router.push(paths.home)
        return
      }
      
      // 新規ユーザーだがトークンがない場合はログインページへ
      if (!token && lineId && session.user.id === session.user.lineId) {
        router.push(`${paths.login}?error=invitation_required`)
        return
      }
      
      // 新規ユーザーの場合のみ招待処理
      if (lineId) {
        handleAcceptInvitation()
      }
    }
  }, [token, lineId, status, session, router])

  const handleAcceptInvitation = async () => {
    if (!token || !lineId) return

    setIsProcessing(true)
    setError(null)

    try {
      // サーバーアクションを呼び出し
      const result = await acceptInvitation(token, lineId, name, email, image)

      if (result.success) {
        // ユーザー作成成功、ホームページへリダイレクト
        router.push(paths.home)
      } else {
        setError(result.error || "招待の処理に失敗しました")
      }
    } catch (error) {
      setError("エラーが発生しました")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {error ? "エラー" : "招待を処理しています"}
          </h2>
          {!error && !lineId && (
            <p className="mt-2 text-center text-sm text-gray-600">
              認証情報を確認中...
            </p>
          )}
        </div>

        <div className="mt-8 space-y-6">
          {isProcessing && (
            <div className="text-center">
              <div className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-gray-700">アカウントを作成しています...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    エラー
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                  <div className="mt-4 space-y-3">
                    {error === "この招待URLは既に使用されています" && (
                      <p className="text-sm text-gray-600">
                        有効な招待URLを取得してください
                      </p>
                    )}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => {
                          if (redirectTimer) {
                            clearTimeout(redirectTimer)
                          }
                          router.push(paths.home)
                        }}
                        className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        ホームページへ移動
                      </button>
                      <button
                        onClick={() => {
                          // ログアウト処理
                          signOut({ callbackUrl: paths.login })
                        }}
                        className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        ログアウト
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function InvitationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="inline-flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-gray-700">読み込み中...</span>
        </div>
      </div>
    }>
      <InvitationContent />
    </Suspense>
  )
}