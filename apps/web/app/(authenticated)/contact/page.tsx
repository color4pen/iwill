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
    <div className="min-h-screen">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">お問い合わせ</h1>
              <p className="text-gray-600 mt-1">
                ご不明な点やご質問がございましたら、お気軽にお問い合わせください
              </p>
            </div>
            <Link
              href="/contact/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              新しい問い合わせ
            </Link>
          </div>
        </div>

        {threads.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">まだ問い合わせはありません</p>
            <Link
              href="/contact/new"
              className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-800"
            >
              <Plus className="h-4 w-4 mr-1" />
              最初の問い合わせを作成
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {threads.map((thread) => {
              const lastMessage = thread.messages[0]
              const unreadCount = thread.messages.filter(m => 
                m.senderRole === 'ADMIN' && !m.isRead
              ).length

              return (
                <Link
                  key={thread.id}
                  href={`/contact/${thread.id}`}
                  className="block p-6 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-medium text-gray-900">
                          {thread.title}
                        </h3>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {categoryLabels[thread.category]}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[thread.status]}`}>
                          {statusLabels[thread.status]}
                        </span>
                      </div>
                      
                      {lastMessage && (
                        <p className="text-gray-600 mt-2 line-clamp-2">
                          {lastMessage.senderRole === 'USER' ? 'あなた: ' : '管理者: '}
                          {lastMessage.content}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          {thread._count.messages}件
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {format(new Date(thread.updatedAt), 'M月d日 HH:mm', { locale: ja })}
                        </span>
                      </div>
                    </div>
                    
                    {unreadCount > 0 && (
                      <div className="ml-4">
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-red-500 text-white text-xs rounded-full">
                          {unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}