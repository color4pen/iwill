import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    // 既読レコードを作成（既に存在する場合はスキップ）
    await prisma.notificationRead.upsert({
      where: {
        userId_notificationId: {
          userId: session.user.id,
          notificationId: id
        }
      },
      update: {},
      create: {
        userId: session.user.id,
        notificationId: id
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return NextResponse.json(
      { error: "Failed to mark notification as read" },
      { status: 500 }
    )
  }
}