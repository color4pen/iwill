'use server'

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function markNotificationAsRead(notificationId: string) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  try {
    await prisma.notificationRead.create({
      data: {
        userId: session.user.id,
        notificationId: notificationId,
      }
    })
    
    revalidatePath('/notifications')
    revalidatePath(`/notifications/${notificationId}`)
  } catch (error: any) {
    // 既に既読の場合はエラーを無視
    if (error.code === 'P2002') {
      return
    }
    throw error
  }
}