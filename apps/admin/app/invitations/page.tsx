import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus } from "lucide-react"
import AdminLayout from "@/components/admin-layout"
import InvitationRow from "@/components/invitation-row"

export default async function InvitationsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

  const invitations = await prisma.invitation.findMany({
    orderBy: { createdAt: "desc" },
  })

  const baseUrl = process.env.NEXTAUTH_URL?.replace('admin.', '') || 'http://localhost:3000'

  return (
    <AdminLayout user={session.user}>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">招待URL管理</h1>
            <Link
              href="/invitations/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              新規発行
            </Link>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
          <div className="bg-white shadow overflow-x-auto sm:rounded-md">
            <ul className="divide-y divide-gray-200 min-w-full">
              {invitations.map((invitation) => (
                <InvitationRow
                  key={invitation.id}
                  invitation={invitation}
                  baseUrl={baseUrl}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}