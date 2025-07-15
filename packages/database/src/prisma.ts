import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// 環境に応じたログレベルの設定
const logLevel = process.env.NODE_ENV === "production" 
  ? ["error", "warn"] 
  : ["query", "error", "warn"]

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: logLevel as any,
})

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

// Prismaクライアントの接続状態を確認するヘルパー関数
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error("Database connection failed:", error)
    return false
  }
}

// クリーンアップ用の関数
export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect()
}