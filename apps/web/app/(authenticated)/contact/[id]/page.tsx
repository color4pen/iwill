import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft, Send } from "lucide-react"
import ChatMessages from "@/components/chat-messages"
import ChatInput from "@/components/chat-input"
import { markMessagesAsRead } from "@/app/actions/inquiries"

export default async function ContactThreadPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect("/login")
  }

  const { id } = await params

  const thread = await prisma.inquiryThread.findUnique({
    where: { 
      id,
      userId: session.user.id 
    },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' }
      }
    }
  })

  if (!thread) {
    redirect("/contact")
  }

  // 管理者からのメッセージを既読にする
  await markMessagesAsRead(thread.id)

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
    <div className="min-h-screen flex flex-col">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/contact"
                className="text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-lg font-semibold">{thread.title}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {categoryLabels[thread.category]}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[thread.status]}`}>
                    {statusLabels[thread.status]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden bg-gray-50">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <ChatMessages 
            messages={thread.messages} 
            currentUserId={session.user.id}
          />
          
          {thread.status === 'OPEN' && (
            <ChatInput threadId={thread.id} />
          )}
          
          {thread.status !== 'OPEN' && (
            <div className="p-4 bg-yellow-50 border-t border-yellow-200">
              <p className="text-sm text-yellow-800 text-center">
                この問い合わせは{statusLabels[thread.status]}です
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}