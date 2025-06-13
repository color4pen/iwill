"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { InquiryStatus } from "@prisma/client"

export async function replyToInquiry(threadId: string, content: string) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  await prisma.inquiryMessage.create({
    data: {
      threadId,
      senderId: session.user.id,
      senderName: session.user.name || "管理者",
      senderRole: "ADMIN",
      content,
    }
  })

  // スレッドの更新日時を更新
  await prisma.inquiryThread.update({
    where: { id: threadId },
    data: { updatedAt: new Date() }
  })

  revalidatePath(`/inquiries/${threadId}`)
  revalidatePath("/inquiries")
}

export async function updateThreadStatus(threadId: string, status: InquiryStatus) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  await prisma.inquiryThread.update({
    where: { id: threadId },
    data: { status }
  })

  revalidatePath(`/inquiries/${threadId}`)
  revalidatePath("/inquiries")
}

export async function markAdminMessagesAsRead(threadId: string, userId: string) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  // ユーザーからのメッセージを既読にする
  await prisma.inquiryMessage.updateMany({
    where: {
      threadId,
      senderId: userId,
      senderRole: "USER",
      isRead: false
    },
    data: {
      isRead: true,
      readAt: new Date()
    }
  })

  revalidatePath(`/inquiries/${threadId}`)
}