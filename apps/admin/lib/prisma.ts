import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query', 'error', 'warn'],
})

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// デバッグ用：Prismaクライアントが正しく初期化されているか確認
console.log('Prisma Client initialized:', !!prisma)
console.log('Prisma Client methods:', Object.keys(prisma))