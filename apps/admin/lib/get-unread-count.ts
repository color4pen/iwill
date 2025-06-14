import { prisma } from "@/lib/prisma"

export async function getUnreadInquiryCountForAdmin() {
  const threads = await prisma.inquiryThread.findMany({
    where: {
      status: 'OPEN'
    },
    include: {
      messages: {
        where: {
          senderRole: 'USER',
          isRead: false
        }
      }
    }
  })

  return threads.reduce((total, thread) => total + thread.messages.length, 0)
}