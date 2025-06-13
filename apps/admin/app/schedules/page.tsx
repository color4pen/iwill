import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus, Clock, Edit } from "lucide-react"
import AdminLayout from "@/components/admin-layout"
import ScheduleDeleteButton from "@/components/schedule-delete-button"

export default async function SchedulesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

  const schedules = await prisma.schedule.findMany({
    orderBy: { order: "asc" },
  })

  return (
    <AdminLayout user={session.user}>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">タイムスケジュール管理</h1>
            <Link
              href="/schedules/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              新規追加
            </Link>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {schedules.length === 0 ? (
                <li className="px-4 py-8 text-center text-gray-500">
                  スケジュールが登録されていません
                </li>
              ) : (
                schedules.map((schedule) => (
                  <li key={schedule.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-16 h-16 ${schedule.colorBg} rounded-full flex items-center justify-center mr-4`}>
                            <span className={`font-bold ${schedule.colorText}`}>{schedule.time}</span>
                          </div>
                          <div>
                            <p className="text-lg font-medium text-gray-900 flex items-center">
                              {schedule.icon && (
                                <Clock className={`w-5 h-5 mr-2 ${schedule.colorText}`} />
                              )}
                              {schedule.title}
                            </p>
                            {schedule.description && (
                              <p className="text-sm text-gray-500 mt-1">{schedule.description}</p>
                            )}
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                schedule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {schedule.isActive ? '公開' : '非公開'}
                              </span>
                              <span className="ml-4">
                                表示順: {schedule.order}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/schedules/${schedule.id}/edit`}
                            className="p-2 text-gray-500 hover:text-gray-700"
                            title="編集"
                          >
                            <Edit className="h-5 w-5" />
                          </Link>
                          <ScheduleDeleteButton scheduleId={schedule.id} />
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}