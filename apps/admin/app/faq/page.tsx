import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus, Edit2, GripVertical } from "lucide-react"
import FAQDeleteButton from "@/components/faq-delete-button"
import AdminLayout from "@/components/admin-layout"
import FAQActiveToggle from "@/components/faq-active-toggle"

export default async function FAQPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

  const faqs = await prisma.fAQ.findMany({
    orderBy: [
      { category: "asc" },
      { order: "asc" },
    ],
  })

  // カテゴリーのラベル
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'GENERAL':
        return '一般'
      case 'VENUE':
        return '会場・受付'
      case 'GIFT':
        return 'ご祝儀・ギフト'
      case 'ATTENDANCE':
        return '出席情報'
      case 'MEDIA':
        return 'メディア'
      default:
        return category
    }
  }

  // カテゴリーのスタイル
  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'GENERAL':
        return 'bg-gray-100 text-gray-800'
      case 'VENUE':
        return 'bg-green-100 text-green-800'
      case 'GIFT':
        return 'bg-purple-100 text-purple-800'
      case 'ATTENDANCE':
        return 'bg-blue-100 text-blue-800'
      case 'MEDIA':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // カテゴリー別にグループ化
  const groupedFaqs = faqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = []
    }
    acc[faq.category].push(faq)
    return acc
  }, {} as Record<string, typeof faqs>)

  return (
    <AdminLayout user={session.user}>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">FAQ管理</h1>
            <Link
              href="/faq/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              新規作成
            </Link>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6 space-y-6">
          {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
            <div key={category} className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${getCategoryStyle(category)}`}>
                    {getCategoryLabel(category)}
                  </span>
                  <span className="text-sm text-gray-500">({categoryFaqs.length}件)</span>
                </h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {categoryFaqs.map((faq) => (
                  <li key={faq.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="flex items-center mt-1">
                            <GripVertical className="h-5 w-5 text-gray-400" />
                            <span className="ml-1 text-sm text-gray-500">#{faq.order}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-medium text-gray-900">
                                {faq.question}
                              </p>
                              <FAQActiveToggle faq={faq} />
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-2">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                        <div className="ml-4 flex items-center space-x-2">
                          <Link
                            href={`/faq/${faq.id}/edit`}
                            className="p-2 text-gray-500 hover:text-gray-700"
                          >
                            <Edit2 className="h-5 w-5" />
                          </Link>
                          <FAQDeleteButton id={faq.id} />
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          {Object.keys(groupedFaqs).length === 0 && (
            <div className="bg-white shadow sm:rounded-md p-6 text-center text-gray-500">
              FAQが登録されていません
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}