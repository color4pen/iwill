import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  
  console.log('Session:', session)
  
  if (!session) {
    console.log('No session')
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // お知らせ一覧を取得（既読情報も含む）
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        reads: {
          where: {
            userId: session.user!.id
          }
        }
      }
    })
    
    console.log('Found notifications:', notifications.length)

    // 既読状態を含めてフォーマット
    const formattedNotifications = notifications.map(notification => ({
      id: notification.id,
      title: notification.title,
      content: notification.content,
      category: notification.category,
      date: notification.createdAt.toISOString(),
      read: notification.reads.length > 0
    }))

    return NextResponse.json(formattedNotifications)
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    )
  }
}