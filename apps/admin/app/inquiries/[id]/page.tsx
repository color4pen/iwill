import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import AdminLayout from "@/components/admin-layout"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import AdminChatMessages from "@/components/admin-chat-messages"
import AdminChatInput from "@/components/admin-chat-input"
import ThreadStatusSelector from "@/components/thread-status-selector"
import { markAdminMessagesAsRead } from "@/app/actions/inquiries"

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

  // ユーザーからのメッセージを既読にする
  await markAdminMessagesAsRead(thread.id, thread.userId)

  const categoryLabels = {
    GENERAL: "一般",
    ATTENDANCE: "出欠",
    VENUE: "会場",
    GIFT: "ご祝儀",
    OTHER: "その他"
  }

  return (
    <AdminLayout user={session.user}>
      <div className="h-screen flex flex-col">
        <div className="bg-white shadow-sm border-b px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/inquiries"
                className="text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold">{thread.title}</h1>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {categoryLabels[thread.category]}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
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

        <div className="flex-1 overflow-hidden bg-gray-50 flex flex-col">
          <AdminChatMessages 
            messages={thread.messages}
          />
          
          <AdminChatInput threadId={thread.id} />
        </div>
      </div>
    </AdminLayout>
  )
}