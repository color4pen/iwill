import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import FAQForm from "@/components/faq-form"
import AdminLayout from "@/components/admin-layout"

export default async function EditFAQPage({ 
  params 
}: { 
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

  const { id } = await params

  const faq = await prisma.fAQ.findUnique({
    where: { id },
  })

  if (!faq) {
    redirect("/faq")
  }

  return (
    <AdminLayout user={session.user}>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">FAQ編集</h1>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
          <FAQForm faq={faq} />
        </div>
      </div>
    </AdminLayout>
  )
}