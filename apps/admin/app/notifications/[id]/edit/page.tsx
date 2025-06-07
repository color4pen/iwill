import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import NotificationForm from "@/components/notification-form"
import AdminLayout from "@/components/admin-layout"

export default async function EditNotificationPage({ 
  params 
}: { 
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

  const { id } = await params

  const notification = await prisma.notification.findUnique({
    where: { id },
  })

  if (!notification) {
    redirect("/notifications")
  }

  return (
    <AdminLayout user={session.user}>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">お知らせ編集</h1>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
          <NotificationForm notification={notification} />
        </div>
      </div>
    </AdminLayout>
  )
}