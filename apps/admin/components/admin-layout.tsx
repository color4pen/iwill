import AdminSidebar from "./admin-sidebar"
import { getUnreadInquiryCountForAdmin } from "@/lib/get-unread-count"

interface AdminLayoutProps {
  children: React.ReactNode
  user?: {
    name?: string | null
    email?: string | null
  }
}

export default async function AdminLayout({ children, user }: AdminLayoutProps) {
  const unreadCount = await getUnreadInquiryCountForAdmin()

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar user={user} unreadCount={unreadCount} />
      
      {/* メインコンテンツ */}
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}