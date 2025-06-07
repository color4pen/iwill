import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import InvitationForm from "@/components/invitation-form"
import AdminLayout from "@/components/admin-layout"

export default async function NewInvitationPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

  return (
    <AdminLayout user={session.user}>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">招待URL新規発行</h1>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
          <InvitationForm />
        </div>
      </div>
    </AdminLayout>
  )
}