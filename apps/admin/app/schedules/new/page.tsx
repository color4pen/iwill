import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import AdminLayout from "@/components/admin-layout"
import ScheduleForm from "@/components/schedule-form"

export default async function NewSchedulePage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

  return (
    <AdminLayout user={session.user}>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            スケジュール新規追加
          </h1>
          <ScheduleForm />
        </div>
      </div>
    </AdminLayout>
  )
}