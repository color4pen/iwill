"use server"

import { prisma } from "@/lib/prisma"

export async function acceptInvitation(
  token: string,
  lineId: string,
  name?: string | null,
  email?: string | null,
  image?: string | null
) {
  try {
    // トークンの有効性をチェック
    const invitation = await prisma.invitation.findUnique({
      where: { token },
    })

    if (!invitation) {
      return { error: "無効な招待URLです" }
    }

    if (invitation.isUsed) {
      return { error: "この招待URLは既に使用されています" }
    }

    if (invitation.expiresAt && new Date(invitation.expiresAt) < new Date()) {
      return { error: "この招待URLは有効期限切れです" }
    }

    // 既存ユーザーをチェック
    const existingUser = await prisma.user.findUnique({
      where: { lineId },
    })

    if (existingUser) {
      return { error: "このアカウントは既に登録されています" }
    }

    // ユーザーを作成
    const user = await prisma.user.create({
      data: {
        lineId,
        name: name || invitation.name || null,
        email: email || invitation.email || null,
        image: image || null,
        role: 'USER',
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

    return { success: true, user }
  } catch (error) {
    console.error("Failed to accept invitation:", error)
    return { error: "招待の処理に失敗しました" }
  }
}