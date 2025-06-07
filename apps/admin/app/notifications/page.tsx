import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus, Edit2 } from "lucide-react"
import DeleteNotificationButton from "@/components/delete-notification-button"
import AdminLayout from "@/components/admin-layout"

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <AdminLayout user={session.user}>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">お知らせ管理</h1>
            <Link
              href="/notifications/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              新規作成
            </Link>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <li key={notification.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {notification.title}
                        </p>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                          {notification.content}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                          <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full whitespace-nowrap ${
                            notification.category === 'IMPORTANT' ? 'bg-red-100 text-red-800' :
                            notification.category === 'SCHEDULE' ? 'bg-yellow-100 text-yellow-800' :
                            notification.category === 'VENUE' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {notification.category === 'GENERAL' && '一般'}
                            {notification.category === 'SCHEDULE' && 'スケジュール'}
                            {notification.category === 'VENUE' && '会場'}
                            {notification.category === 'IMPORTANT' && '重要'}
                          </span>
                          <span>
                            作成日: {new Date(notification.createdAt).toLocaleDateString('ja-JP')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex items-center space-x-2">
                        <Link
                          href={`/notifications/${notification.id}/edit`}
                          className="p-2 text-gray-500 hover:text-gray-700"
                        >
                          <Edit2 className="h-5 w-5" />
                        </Link>
                        <DeleteNotificationButton notificationId={notification.id} />
                      </div>
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