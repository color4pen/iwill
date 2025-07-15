// Re-export everything from Prisma Client
export * from "@prisma/client"

// Export our custom Prisma instance and helpers
export { prisma, checkDatabaseConnection, disconnectDatabase } from "./prisma"