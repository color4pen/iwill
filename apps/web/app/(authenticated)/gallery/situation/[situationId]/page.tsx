import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getMediaBySituation } from "@/app/actions/media"
import { prisma } from "@/lib/prisma"
import GalleryClient from "../../gallery-client"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{
    situationId: string
  }>
}

export default async function SituationMediaPage({ params }: PageProps) {
  const { situationId } = await params
  const session = await getServerSession(authOptions)
  
  const user = session?.user?.id ? await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  }) : null
  
  const isAdmin = user?.role === 'ADMIN'
  
  // シチュエーション情報を取得
  const situation = await prisma.mediaSituation.findUnique({
    where: { id: situationId },
  })

  if (!situation) {
    notFound()
  }

  // そのシチュエーションのメディアを取得
  const situationMedia = await getMediaBySituation(situationId, 100)

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/gallery"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          ギャラリートップに戻る
        </Link>
        
        <h1 className="text-2xl font-bold mb-2">{situation.name}</h1>
        {situation.description && (
          <p className="text-gray-600">{situation.description}</p>
        )}
        <p className="text-sm text-gray-500 mt-2">
          {situationMedia.length}件の写真・動画
        </p>
      </div>

      <GalleryClient 
        initialMedia={situationMedia}
        currentUserId={session?.user?.id}
        customEmptyMessage="まだメディアがありません"
        isAdmin={isAdmin}
      />
    </div>
  )
}