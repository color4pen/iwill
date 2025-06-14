'use server'

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function markNotificationAsRead(notificationId: string) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    console.error("markNotificationAsRead: No user ID in session", session)
    throw new Error("Unauthorized")
  }

  console.log("markNotificationAsRead: Attempting to mark as read", {
    userId: session.user.id,
    notificationId: notificationId
  })

  try {
    const result = await prisma.notificationRead.create({
      data: {
        userId: session.user.id,
        notificationId: notificationId,
      }
    })
    
    console.log("markNotificationAsRead: Successfully created", result)
    
    revalidatePath('/notifications')
    revalidatePath(`/notifications/${notificationId}`)
  } catch (error: any) {
    // 既に既読の場合はエラーを無視
    if (error.code === 'P2002') {
      console.log("markNotificationAsRead: Already marked as read")
      return
    }
    console.error("markNotificationAsRead: Error", error)
    throw error
  }
}