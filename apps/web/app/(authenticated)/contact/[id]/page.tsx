import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft, Send } from "lucide-react"
import ChatMessages from "@/components/chat-messages"
import ChatInput from "@/components/chat-input"
import MarkAsRead from "@/components/mark-as-read"
import HideLayout from "@/components/hide-layout"
import { paths } from "@/lib/paths"
import AutoRefreshMessages from "@/components/auto-refresh-messages"
import { INQUIRY_CATEGORY_LABELS, INQUIRY_STATUS_LABELS, INQUIRY_STATUS_COLORS } from "@repo/types/constants"

export default async function ContactThreadPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect(paths.login)
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
    redirect(paths.contact.index)
  }

  const categoryLabels = INQUIRY_CATEGORY_LABELS
  const statusLabels = INQUIRY_STATUS_LABELS
  const statusColors = INQUIRY_STATUS_COLORS

  return (
    <>
      <HideLayout />
      <div className="flex flex-col h-[100vh] h-[100dvh] bg-white">
        {/* Fixed Header */}
        <div className="bg-white shadow-sm border-b flex-shrink-0">
          <div className="px-4 py-3">
            <div className="flex items-center gap-3">
              <Link
                href={paths.contact.index}
                className="text-gray-500 hover:text-gray-700 p-2 -ml-2"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-semibold truncate mb-1">{thread.title}</h1>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {categoryLabels[thread.category]}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColors[thread.status]}`}>
                    {statusLabels[thread.status]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Messages Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 min-h-0">
          <MarkAsRead threadId={thread.id} />
          <AutoRefreshMessages threadId={thread.id} />
          <ChatMessages 
            messages={thread.messages} 
            currentUserId={session.user.id}
            variant="user"
          />
          <div className="h-4"></div>
        </div>
        
        {/* Fixed Input/Status at Bottom */}
        {thread.status === 'OPEN' ? (
          <div className="flex-shrink-0">
            <ChatInput threadId={thread.id} />
          </div>
        ) : (
          <div className="flex-shrink-0 p-4 bg-yellow-50 border-t border-yellow-200">
            <p className="text-sm text-yellow-800 text-center">
              この問い合わせは{statusLabels[thread.status]}です
            </p>
          </div>
        )}
      </div>
    </>
  )
}