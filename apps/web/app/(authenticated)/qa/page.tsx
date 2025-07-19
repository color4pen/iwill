import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"
import Link from "next/link"
import { paths } from "@/lib/paths"

const prisma = new PrismaClient()

export default async function QAPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect(paths.login)
  }

  const faqs = await prisma.fAQ.findMany({
    where: { isActive: true },
    orderBy: [
      { category: "asc" },
      { order: "asc" },
    ],
  })

  await prisma.$disconnect()

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

  // カテゴリーのアイコン
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'GENERAL':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'VENUE':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
      case 'GIFT':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
        )
      case 'ATTENDANCE':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'MEDIA':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
      default:
        return null
    }
  }

  // カテゴリー別にグループ化
  const groupedFaqs = faqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = []
    }
    acc[faq.category]!.push(faq)
    return acc
  }, {} as Record<string, typeof faqs>)

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">よくある質問</h2>
        <p className="mt-1 text-sm text-gray-600">
          結婚式に関するよくある質問をまとめました
        </p>
      </div>

      {Object.keys(groupedFaqs).length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          よくある質問はまだ登録されていません
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
            <div key={category}>
              <div className="flex items-center gap-2 mb-4 text-gray-700">
                {getCategoryIcon(category)}
                <h3 className="text-lg font-semibold">
                  {getCategoryLabel(category)}
                </h3>
              </div>
              
              <div className="space-y-4">
                {categoryFaqs.map((faq) => (
                  <details
                    key={faq.id}
                    className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                  >
                    <summary className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors flex items-start justify-between">
                      <span className="font-medium text-gray-900 pr-4">
                        {faq.question}
                      </span>
                      <svg
                        className="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform group-open:rotate-180"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="px-6 pb-4 pt-2">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {faq.answer}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Link 
          href={paths.home} 
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          ホームに戻る
        </Link>
      </div>
    </>
  )
}