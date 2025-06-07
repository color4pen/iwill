import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import AdminLayout from "@/components/admin-layout"
import UserActions from "@/components/user-actions"
import { Shield, User } from "lucide-react"

export default async function UsersPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

  const users = await prisma.user.findMany({
    include: {
      attendance: true,
      notifications: true,
      media: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <AdminLayout user={session.user}>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">ユーザー管理</h1>
            <div className="text-sm text-gray-500">
              合計: {users.length}人 (管理者: {users.filter(u => u.role === 'ADMIN').length}人)
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {users.map((user) => (
                <li key={user.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          {user.image ? (
                            <img
                              className="h-10 w-10 rounded-full"
                              src={user.image}
                              alt={user.name || ''}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <User className="h-6 w-6 text-gray-600" />
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-gray-900">
                                {user.name || '名前未設定'}
                              </p>
                              {user.role === 'ADMIN' && (
                                <span className="inline-flex items-center" title="管理者">
                                  <Shield className="h-4 w-4 text-blue-600" />
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              {user.email || 'メールアドレス未設定'}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span>
                            LINE ID: {user.lineId}
                          </span>
                          <span>
                            登録日: {new Date(user.createdAt).toLocaleDateString('ja-JP')}
                          </span>
                          {user.attendance && (
                            <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full whitespace-nowrap ${
                              user.attendance.status === 'ATTENDING' ? 'bg-green-100 text-green-800' :
                              user.attendance.status === 'NOT_ATTENDING' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {user.attendance.status === 'ATTENDING' && '出席'}
                              {user.attendance.status === 'NOT_ATTENDING' && '欠席'}
                              {user.attendance.status === 'UNDECIDED' && '未定'}
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-gray-400">
                          <span>
                            お知らせ: {user.notifications.length}件既読
                          </span>
                          <span>
                            メディア: {user.media.length}件アップロード
                          </span>
                        </div>
                      </div>
                      <UserActions user={user} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}