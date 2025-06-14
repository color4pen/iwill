import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import AdminChatMessages from "@/components/admin-chat-messages"
import AdminChatInput from "@/components/admin-chat-input"
import ThreadStatusSelector from "@/components/thread-status-selector"
import AdminMarkAsRead from "@/components/admin-mark-as-read"

export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

  const { id } = await params

  const thread = await prisma.inquiryThread.findUnique({
    where: { id },
    include: {
      user: true,
      messages: {
        orderBy: { createdAt: 'asc' }
      }
    }
  })

  if (!thread) {
    redirect("/inquiries")
  }


  return (
    <div className="h-screen flex flex-col bg-white">
      <div className="bg-white shadow-sm border-b px-4 py-3 md:py-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            <Link
              href="/inquiries"
              className="text-gray-500 hover:text-gray-700 p-2 -ml-2"
            >
              <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
            </Link>
            <div className="flex-1">
              <h1 className="text-base md:text-lg font-semibold truncate">{thread.title}</h1>
              <p className="text-xs md:text-sm text-gray-600">
                {thread.user.name || thread.user.email || "名前未設定"}
              </p>
            </div>
          </div>
          
          <ThreadStatusSelector 
            threadId={thread.id}
            currentStatus={thread.status}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50">
        <AdminMarkAsRead 
          threadId={thread.id} 
          userId={thread.userId} 
        />
        <AdminChatMessages 
          messages={thread.messages}
          currentUserId={session.user?.id}
          variant="admin"
        />
      </div>
      
      {thread.status === 'OPEN' ? (
        <div className="flex-shrink-0">
          <AdminChatInput threadId={thread.id} />
        </div>
      ) : (
        <div className="flex-shrink-0 p-4 bg-yellow-50 border-t border-yellow-200">
          <p className="text-sm text-yellow-800 text-center">
            この問い合わせは{thread.status === 'RESOLVED' ? '解決済み' : 'クローズ'}です
          </p>
        </div>
      )}
    </div>
  )
}