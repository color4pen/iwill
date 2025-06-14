import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect("/login")
  }

  // お知らせを取得（既読情報も含む）
  const notifications = await prisma.notification.findMany({
    include: {
      reads: {
        where: {
          userId: session.user.id
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

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
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">お知らせ</h2>
      </div>

      {notifications.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          お知らせはありません
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {notifications.map(notification => {
            const isRead = notification.reads.length > 0
            
            return (
              <Link
                key={notification.id}
                href={`/notifications/${notification.id}`}
                className="block py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className={`h-2 w-2 rounded-full ${isRead ? 'bg-gray-300' : 'bg-blue-600'}`} />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`text-lg font-medium ${isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                        {notification.title}
                      </h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${getCategoryStyle(notification.category)}`}>
                        {getCategoryLabel(notification.category)}
                      </span>
                    </div>
                    <p className={`line-clamp-2 ${isRead ? 'text-gray-500' : 'text-gray-600'}`}>
                      {notification.content}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}