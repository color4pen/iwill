import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { notFound } from "next/navigation"
import MarkNotificationAsRead from "@/components/mark-notification-as-read"
import { paths } from "@/lib/paths"

export default async function NotificationDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect(paths.login)
  }

  const { id } = await params

  const notification = await prisma.notification.findUnique({
    where: { id },
  })

  if (!notification) {
    notFound()
  }



  // 日付フォーマット
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  // カテゴリーのスタイル
  const getCategoryStyle = (category: string | null) => {
    switch (category) {
      case 'IMPORTANT':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'SCHEDULE':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'VENUE':
        return 'text-green-600 bg-green-50 border-green-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  // カテゴリーのラベル
  const getCategoryLabel = (category: string | null) => {
    switch (category) {
      case 'IMPORTANT':
        return '重要'
      case 'SCHEDULE':
        return 'スケジュール'
      case 'VENUE':
        return '会場'
      default:
        return '一般'
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <MarkNotificationAsRead notificationId={id} />
      <div className="mb-6">
        <Link 
          href={paths.notifications.index} 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          お知らせ一覧に戻る
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {notification.title}
          </h1>
          <span className={`text-xs px-2 py-0.5 rounded-full border whitespace-nowrap ${getCategoryStyle(notification.category)}`}>
            {getCategoryLabel(notification.category)}
          </span>
        </div>

        <div className="text-sm text-gray-500 mb-6">
          {formatDate(notification.createdAt)}
        </div>

        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap">
            {notification.content}
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link 
          href={paths.home} 
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          ホームに戻る
        </Link>
      </div>
    </div>
  )
}