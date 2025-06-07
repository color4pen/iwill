"use client"

import { X } from "lucide-react"
import { useEffect } from "react"

interface User {
  id: string
  lineId: string
  name: string | null
  email: string | null
  image: string | null
  role: string
  createdAt: Date
  attendance?: {
    status: string
    numberOfGuests: number
    dietaryRestrictions: string | null
    messageToCouple: string | null
  } | null
}

interface UserDetailModalProps {
  user: User
  onClose: () => void
}

export default function UserDetailModal({ user, onClose }: UserDetailModalProps) {
  useEffect(() => {
    // モーダルが開いている間はbodyのスクロールを無効化
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <>
      {/* オーバーレイ */}
      <div className="fixed inset-0 z-[100] transition-opacity" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onClick={onClose} />
      
      {/* モーダルコンテンツ */}
      <div className="fixed inset-0 z-[101] overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                ユーザー詳細
              </h3>

              <div className="space-y-4">
                {user.image && (
                  <div className="flex justify-center">
                    <img
                      className="h-20 w-20 rounded-full"
                      src={user.image}
                      alt={user.name || ''}
                    />
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium text-gray-500">基本情報</h4>
                  <dl className="mt-2 text-sm text-gray-900 space-y-1">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">名前:</dt>
                      <dd className="font-medium">{user.name || '未設定'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">メール:</dt>
                      <dd className="font-medium">{user.email || '未設定'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">LINE ID:</dt>
                      <dd className="font-medium">{user.lineId}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">ロール:</dt>
                      <dd className="font-medium">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          user.role === 'ADMIN' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role === 'ADMIN' ? '管理者' : 'ユーザー'}
                        </span>
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">登録日:</dt>
                      <dd className="font-medium">{new Date(user.createdAt).toLocaleDateString('ja-JP')}</dd>
                    </div>
                  </dl>
                </div>

                {user.attendance && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">出欠情報</h4>
                    <dl className="mt-2 text-sm text-gray-900 space-y-1">
                      <div className="flex justify-between">
                        <dt className="text-gray-500">ステータス:</dt>
                        <dd className="font-medium">
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            user.attendance.status === 'ATTENDING' ? 'bg-green-100 text-green-800' :
                            user.attendance.status === 'NOT_ATTENDING' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {user.attendance.status === 'ATTENDING' && '出席'}
                            {user.attendance.status === 'NOT_ATTENDING' && '欠席'}
                            {user.attendance.status === 'UNDECIDED' && '未定'}
                          </span>
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">ゲスト数:</dt>
                        <dd className="font-medium">{user.attendance.numberOfGuests}人</dd>
                      </div>
                      {user.attendance.dietaryRestrictions && (
                        <div>
                          <dt className="text-gray-500">食事制限:</dt>
                          <dd className="font-medium mt-1">{user.attendance.dietaryRestrictions}</dd>
                        </div>
                      )}
                      {user.attendance.messageToCouple && (
                        <div>
                          <dt className="text-gray-500">メッセージ:</dt>
                          <dd className="font-medium mt-1 whitespace-pre-wrap">{user.attendance.messageToCouple}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              閉じる
            </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}