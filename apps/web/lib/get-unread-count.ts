import { prisma } from "@/lib/prisma"

export async function getUnreadInquiryCount(userId: string) {
  const threads = await prisma.inquiryThread.findMany({
    where: { userId },
    include: {
      messages: {
        where: {
          senderRole: 'ADMIN',
          isRead: false
        }
      }
    }
  })

  return threads.reduce((total, thread) => total + thread.messages.length, 0)
}