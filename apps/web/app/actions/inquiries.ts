"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { InquiryCategory } from "@prisma/client"

export async function createInquiryThread(
  title: string,
  category: InquiryCategory,
  initialMessage: string
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  const thread = await prisma.inquiryThread.create({
    data: {
      userId: session.user.id,
      title,
      category,
      messages: {
        create: {
          senderId: session.user.id,
          senderName: session.user.name || "ゲスト",
          senderRole: "USER",
          content: initialMessage,
        }
      }
    }
  })

  redirect(`/contact/${thread.id}`)
}

export async function sendMessage(threadId: string, content: string) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  // スレッドの所有者かチェック
  const thread = await prisma.inquiryThread.findUnique({
    where: { id: threadId },
    select: { userId: true }
  })

  if (!thread || thread.userId !== session.user.id) {
    throw new Error("Forbidden")
  }

  await prisma.inquiryMessage.create({
    data: {
      threadId,
      senderId: session.user.id,
      senderName: session.user.name || "ゲスト",
      senderRole: "USER",
      content,
    }
  })

  // スレッドの更新日時を更新
  await prisma.inquiryThread.update({
    where: { id: threadId },
    data: { updatedAt: new Date() }
  })

  revalidatePath(`/contact/${threadId}`)
}

export async function markMessagesAsRead(threadId: string) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  // 自分宛のメッセージを既読にする
  await prisma.inquiryMessage.updateMany({
    where: {
      threadId,
      senderRole: "ADMIN",
      isRead: false
    },
    data: {
      isRead: true,
      readAt: new Date()
    }
  })

  revalidatePath(`/contact/${threadId}`)
}