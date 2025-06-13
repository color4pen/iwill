import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import NewInquiryForm from "@/components/new-inquiry-form"

export default async function NewContactPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">新しい問い合わせ</h1>
        <p className="text-gray-600 mb-8">
          お問い合わせ内容をご記入ください。管理者より返信させていただきます。
        </p>
        
        <NewInquiryForm />
      </div>
    </div>
  )
}