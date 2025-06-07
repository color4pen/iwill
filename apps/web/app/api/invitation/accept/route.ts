import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token, lineId, name, email, image } = body

    // トークンの有効性をチェック
    const invitation = await prisma.invitation.findUnique({
      where: { token },
    })

    if (!invitation) {
      return NextResponse.json(
        { error: "無効な招待URLです" },
        { status: 400 }
      )
    }

    if (invitation.isUsed) {
      return NextResponse.json(
        { error: "この招待URLは既に使用されています" },
        { status: 400 }
      )
    }

    if (invitation.expiresAt && new Date(invitation.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: "この招待URLは有効期限切れです" },
        { status: 400 }
      )
    }

    // ユーザーを作成
    const user = await prisma.user.create({
      data: {
        id: lineId,
        lineId,
        name: name || invitation.name || null,
        email: email || invitation.email || null,
        image: image || null,
      },
    })

    // 招待を使用済みにマーク
    await prisma.invitation.update({
      where: { id: invitation.id },
      data: {
        isUsed: true,
        usedAt: new Date(),
        usedBy: user.id,
      },
    })

    await prisma.$disconnect()

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("Failed to accept invitation:", error)
    await prisma.$disconnect()
    
    return NextResponse.json(
      { error: "招待の処理に失敗しました" },
      { status: 500 }
    )
  }
}