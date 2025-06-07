import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus, Check, X } from "lucide-react"
import AdminLayout from "@/components/admin-layout"
import InvitationActions from "@/components/invitation-actions"

export default async function InvitationsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

  const invitations = await prisma.invitation.findMany({
    orderBy: { createdAt: "desc" },
  })

  const baseUrl = process.env.NEXTAUTH_URL?.replace('/admin', '/web') || 'http://localhost:3001'

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
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {invitations.map((invitation) => (
                <li key={invitation.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          {invitation.isUsed ? (
                            <Check className="h-5 w-5 text-green-500 mr-2" />
                          ) : invitation.expiresAt && new Date(invitation.expiresAt) < new Date() ? (
                            <X className="h-5 w-5 text-red-500 mr-2" />
                          ) : (
                            <div className="h-5 w-5 mr-2" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {invitation.name || invitation.email || '名前未設定'}
                            </p>
                            <p className="text-sm text-gray-500">
                              招待URL: {baseUrl}/login?invitation={invitation.token}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            invitation.isUsed ? 'bg-green-100 text-green-800' :
                            invitation.expiresAt && new Date(invitation.expiresAt) < new Date() ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {invitation.isUsed ? '使用済み' :
                             invitation.expiresAt && new Date(invitation.expiresAt) < new Date() ? '期限切れ' :
                             '未使用'}
                          </span>
                          <span className="ml-4">
                            作成日: {new Date(invitation.createdAt).toLocaleDateString('ja-JP')}
                          </span>
                          {invitation.expiresAt && (
                            <span className="ml-4">
                              有効期限: {new Date(invitation.expiresAt).toLocaleDateString('ja-JP')}
                            </span>
                          )}
                          {invitation.usedAt && (
                            <span className="ml-4">
                              使用日: {new Date(invitation.usedAt).toLocaleDateString('ja-JP')}
                            </span>
                          )}
                        </div>
                        {invitation.notes && (
                          <p className="mt-1 text-sm text-gray-500">
                            メモ: {invitation.notes}
                          </p>
                        )}
                      </div>
                      <InvitationActions
                        invitationUrl={`${baseUrl}/login?invitation=${invitation.token}`}
                        invitationId={invitation.id}
                      />
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