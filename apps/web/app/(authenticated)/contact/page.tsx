import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus, MessageSquare, Check, Clock } from "lucide-react"
import { format } from "date-fns"
import { ja } from "date-fns/locale"

export default async function ContactPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect("/login")
  }

  const threads = await prisma.inquiryThread.findMany({
    where: { userId: session.user.id },
    include: {
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

  return (
    <div className="flex flex-col h-full">
      {/* ヘッダー */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <h1 className="text-lg font-semibold">お問い合わせ</h1>
        </div>
      </div>

      {/* スレッド一覧 */}
      <div className="flex-1 overflow-y-auto">
        {threads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <MessageSquare className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-center mb-6">
              まだ問い合わせはありません
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {threads.map((thread) => {
              const lastMessage = thread.messages[0]
              const unreadCount = thread.messages.filter(m => 
                m.senderRole === 'ADMIN' && !m.isRead
              ).length

              return (
                <Link
                  key={thread.id}
                  href={`/contact/${thread.id}`}
                  className="block"
                >
                  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900 flex-1 mr-2">
                        {thread.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[thread.status]}`}>
                          {statusLabels[thread.status]}
                        </span>
                        {unreadCount > 0 && (
                          <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 bg-red-500 text-white text-xs font-bold rounded-full">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {lastMessage && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {lastMessage.content}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3 text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          {categoryLabels[thread.category]}
                        </span>
                        <span className="flex items-center">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {thread._count.messages}
                        </span>
                      </div>
                      <span className="text-gray-400">
                        {format(new Date(thread.updatedAt), 'M/d HH:mm', { locale: ja })}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* 新規作成ボタン */}
      <Link
        href="/contact/new"
        className="fixed bottom-20 right-4 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all"
        style={{ zIndex: 40 }}
      >
        <Plus className="h-6 w-6" />
      </Link>
    </div>
  )
}