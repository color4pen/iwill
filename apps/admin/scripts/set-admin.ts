#!/usr/bin/env node
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const lineId = process.argv[2]
  
  if (!lineId) {
    console.error('使用方法: pnpm tsx scripts/set-admin.ts <LINE_ID>')
    console.error('例: pnpm tsx scripts/set-admin.ts U1234567890abcdef')
    process.exit(1)
  }

  try {
    const user = await prisma.user.update({
      where: { lineId },
      data: { role: 'ADMIN' },
    })

    console.log(`✅ ユーザー ${user.name || user.lineId} に管理者権限を付与しました`)
  } catch (error) {
    console.error('❌ エラー:', error)
    console.error('指定されたLINE IDのユーザーが見つかりません')
  } finally {
    await prisma.$disconnect()
  }
}

main()