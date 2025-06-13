import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import AdminLayout from "@/components/admin-layout"
import Link from "next/link"
import { MessageSquare, Clock, User } from "lucide-react"
import { format } from "date-fns"
import { ja } from "date-fns/locale"

export default async function InquiriesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

  const threads = await prisma.inquiryThread.findMany({
    include: {
      user: true,
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1
      },
      _count: {
        select: { messages: true }
      }
    },
    orderBy: { updatedAt: 'desc' }
  })

  const categoryLabels = {
    GENERAL: "一般",
    ATTENDANCE: "出欠",
    VENUE: "会場",
    GIFT: "ご祝儀",
    OTHER: "その他"
  }

  const statusLabels = {
    OPEN: "対応中",
    RESOLVED: "解決済み",
    CLOSED: "クローズ"
  }

  const statusColors = {
    OPEN: "bg-blue-100 text-blue-800",
    RESOLVED: "bg-green-100 text-green-800",
    CLOSED: "bg-gray-100 text-gray-800"
  }

  // 未読メッセージのカウント
  const unreadCounts = await prisma.inquiryMessage.groupBy({
    by: ['threadId'],
    where: {
      senderRole: 'USER',
      isRead: false
    },
    _count: true
  })

  const unreadMap = Object.fromEntries(
    unreadCounts.map(({ threadId, _count }) => [threadId, _count])
  )

  return (
    <AdminLayout user={session.user}>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">問い合わせ管理</h1>
          <p className="mt-2 text-sm text-gray-600">
            ユーザーからの問い合わせに対応します
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {threads.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                まだ問い合わせはありません
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {threads.map((thread) => {
                  const lastMessage = thread.messages[0]
                  const unreadCount = unreadMap[thread.id] || 0

                  return (
                    <li key={thread.id}>
                      <Link
                        href={`/inquiries/${thread.id}`}
                        className="block hover:bg-gray-50"
                      >
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center">
                                <User className="h-5 w-5 text-gray-400 mr-2" />
                                <p className="text-sm font-medium text-gray-900">
                                  {thread.user.name || thread.user.email || "名前未設定"}
                                </p>
                                {unreadCount > 0 && (
                                  <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-red-500 text-white rounded-full">
                                    {unreadCount}
                                  </span>
                                )}
                              </div>
                              
                              <h3 className="mt-2 text-base font-medium text-gray-900">
                                {thread.title}
                              </h3>
                              
                              {lastMessage && (
                                <p className="mt-1 text-sm text-gray-600 line-clamp-1">
                                  {lastMessage.senderRole === 'USER' ? 'ユーザー: ' : '管理者: '}
                                  {lastMessage.content}
                                </p>
                              )}
                              
                              <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                                <span className="bg-gray-100 px-2 py-1 rounded">
                                  {categoryLabels[thread.category]}
                                </span>
                                <span className={`px-2 py-1 rounded-full ${statusColors[thread.status]}`}>
                                  {statusLabels[thread.status]}
                                </span>
                                <span className="flex items-center">
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  {thread._count.messages}件
                                </span>
                                <span className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {format(new Date(thread.updatedAt), 'M月d日 HH:mm', { locale: ja })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}