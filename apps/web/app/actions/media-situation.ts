"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function updateMediaSituation(mediaId: string, situationId: string | null) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("認証が必要です")
  }

  // メディアの所有者確認
  const media = await prisma.media.findFirst({
    where: {
      id: mediaId,
      userId: session.user.id,
    },
  })

  if (!media) {
    throw new Error("メディアが見つからないか、更新権限がありません")
  }

  // メディアシチュエーションを更新
  await prisma.media.update({
    where: { id: mediaId },
    data: {
      mediaSituationId: situationId,
    },
  })

  revalidatePath("/mypage")
  revalidatePath("/gallery")
  
  return { success: true }
}