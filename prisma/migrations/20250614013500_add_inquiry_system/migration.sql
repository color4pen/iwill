-- CreateEnum
CREATE TYPE "InquiryCategory" AS ENUM ('GENERAL', 'ATTENDANCE', 'VENUE', 'GIFT', 'OTHER');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('OPEN', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "SenderRole" AS ENUM ('USER', 'ADMIN');

-- AlterTable - Drop existing primary key and add id column to NotificationRead
ALTER TABLE "NotificationRead" DROP CONSTRAINT IF EXISTS "NotificationRead_pkey";
ALTER TABLE "NotificationRead" ADD COLUMN "id" TEXT;

-- Update existing rows with unique IDs
UPDATE "NotificationRead" SET "id" = gen_random_uuid()::text WHERE "id" IS NULL;

-- Make id column NOT NULL and set as primary key
ALTER TABLE "NotificationRead" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "NotificationRead" ADD CONSTRAINT "NotificationRead_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "InquiryThread" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "InquiryCategory" NOT NULL,
    "status" "InquiryStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InquiryThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InquiryMessage" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "senderRole" "SenderRole" NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InquiryMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InquiryThread_userId_idx" ON "InquiryThread"("userId");

-- CreateIndex
CREATE INDEX "InquiryThread_status_idx" ON "InquiryThread"("status");

-- CreateIndex
CREATE INDEX "InquiryMessage_threadId_idx" ON "InquiryMessage"("threadId");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationRead_userId_notificationId_key" ON "NotificationRead"("userId", "notificationId");

-- AddForeignKey
ALTER TABLE "InquiryThread" ADD CONSTRAINT "InquiryThread_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InquiryMessage" ADD CONSTRAINT "InquiryMessage_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "InquiryThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;