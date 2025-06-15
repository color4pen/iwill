'use server'

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function getMessages(threadId: string) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
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

  const messages = await prisma.inquiryMessage.findMany({
    where: { threadId },
    orderBy: { createdAt: 'asc' }
  })

  return messages
}