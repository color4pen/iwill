import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getApprovedMedia } from "@/app/actions/media"
import GalleryClient from "../gallery-client"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { prisma } from "@/lib/prisma"

export default async function AllMediaPage() {
  const session = await getServerSession(authOptions)
  const user = session?.user?.id ? await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  }) : null
  
  const isAdmin = user?.role === 'ADMIN'
  const allMedia = await getApprovedMedia(100)

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
        
        <h1 className="text-2xl font-bold mb-2">すべての写真・動画</h1>
        <p className="text-gray-600">
          投稿されたすべての写真と動画を時系列で表示しています。
        </p>
      </div>

      <GalleryClient 
        initialMedia={allMedia}
        currentUserId={session?.user?.id}
        isAdmin={isAdmin}
      />
    </div>
  )
}