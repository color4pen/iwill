"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { signIn } from "next-auth/react"
import { useSession } from "next-auth/react"

export default function InvitationPage() {
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const token = searchParams.get("token")
  const lineId = session?.user?.id || searchParams.get("lineId")
  const name = session?.user?.name || searchParams.get("name")
  const email = session?.user?.email || searchParams.get("email")
  const image = session?.user?.image || searchParams.get("image")

  useEffect(() => {
    if (!token || !lineId) {
      setError("無効な招待URLです")
      return
    }

    // 自動的に招待を受け入れて処理
    handleAcceptInvitation()
  }, [token, lineId])

  const handleAcceptInvitation = async () => {
    if (!token || !lineId) return

    setIsProcessing(true)
    setError(null)

    try {
      // 招待を受け入れてユーザーを作成
      const response = await fetch("/api/invitation/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          lineId,
          name,
          email,
          image,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // ユーザー作成成功、ホームページへリダイレクト
        window.location.href = "/"
      } else {
        setError(data.error || "招待の処理に失敗しました")
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
            招待を処理しています
          </h2>
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
                  <div className="mt-4">
                    <button
                      onClick={() => window.location.href = "/login"}
                      className="text-sm font-medium text-red-800 hover:text-red-700"
                    >
                      ログインページへ戻る
                    </button>
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