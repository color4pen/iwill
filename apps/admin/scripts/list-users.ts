#!/usr/bin/env node
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        lineId: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    console.log('📋 ユーザー一覧:\n')
    console.table(users.map(user => ({
      ID: user.id,
      'LINE ID': user.lineId,
      名前: user.name || '-',
      メール: user.email || '-',
      ロール: user.role,
      登録日: user.createdAt.toLocaleDateString('ja-JP'),
    })))

    console.log(`\n合計: ${users.length} ユーザー`)
    console.log(`管理者: ${users.filter(u => u.role === 'ADMIN').length} ユーザー`)
  } catch (error) {
    console.error('❌ エラー:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()