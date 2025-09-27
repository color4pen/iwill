import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import MediaDetailClient from "./media-detail-client"

interface PageProps {
  params: Promise<{
    mediaId: string
  }>
}

export default async function MediaDetailPage({ params }: PageProps) {
  const { mediaId } = await params
  const session = await getServerSession(authOptions)
  
  const user = session?.user?.id ? await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  }) : null
  
  const isAdmin = user?.role === 'ADMIN'
  
  // メディアを取得
  const media = await prisma.media.findUnique({
    where: { id: mediaId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true
        }
      },
      mediaSituation: true
    }
  })
  
  if (!media) {
    notFound()
  }
  
  return (
    <MediaDetailClient
      media={media}
      currentUserId={session?.user?.id}
      isAdmin={isAdmin}
    />
  )
}