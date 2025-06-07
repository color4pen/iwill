-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('ATTENDING', 'NOT_ATTENDING', 'UNDECIDED');

-- CreateEnum
CREATE TYPE "NotificationCategory" AS ENUM ('GENERAL', 'SCHEDULE', 'VENUE', 'IMPORTANT');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateEnum
CREATE TYPE "FAQCategory" AS ENUM ('GENERAL', 'VENUE', 'GIFT', 'ATTENDANCE', 'MEDIA');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "lineId" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "image" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'line',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "AttendanceStatus" NOT NULL,
    "numberOfGuests" INTEGER NOT NULL DEFAULT 1,
    "dietaryRestrictions" TEXT,
    "messageToCouple" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" "NotificationCategory",
    "priority" "Priority" NOT NULL DEFAULT 'NORMAL',
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationRead" (
    "userId" TEXT NOT NULL,
    "notificationId" TEXT NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationRead_pkey" PRIMARY KEY ("userId","notificationId")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "caption" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeddingInfo" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "ceremonyTime" TEXT NOT NULL,
    "receptionTime" TEXT NOT NULL,
    "venueName" TEXT NOT NULL,
    "venueAddress" TEXT NOT NULL,
    "accessInfo" TEXT NOT NULL,
    "mapUrl" TEXT,
    "venueImageUrl" TEXT,
    "dresscode" TEXT,
    "emergencyContact" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeddingInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FAQ" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" "FAQCategory" NOT NULL,
    "order" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_lineId_key" ON "User"("lineId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_lineId_idx" ON "User"("lineId");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_userId_key" ON "Attendance"("userId");

-- CreateIndex
CREATE INDEX "Attendance_userId_idx" ON "Attendance"("userId");

-- CreateIndex
CREATE INDEX "Notification_publishedAt_idx" ON "Notification"("publishedAt");

-- CreateIndex
CREATE INDEX "NotificationRead_userId_idx" ON "NotificationRead"("userId");

-- CreateIndex
CREATE INDEX "NotificationRead_notificationId_idx" ON "NotificationRead"("notificationId");

-- CreateIndex
CREATE INDEX "Media_userId_idx" ON "Media"("userId");

-- CreateIndex
CREATE INDEX "Media_uploadedAt_idx" ON "Media"("uploadedAt");

-- CreateIndex
CREATE INDEX "Media_isApproved_idx" ON "Media"("isApproved");

-- CreateIndex
CREATE INDEX "Schedule_order_idx" ON "Schedule"("order");

-- CreateIndex
CREATE INDEX "FAQ_category_order_idx" ON "FAQ"("category", "order");

-- CreateIndex
CREATE INDEX "FAQ_isActive_idx" ON "FAQ"("isActive");

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationRead" ADD CONSTRAINT "NotificationRead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationRead" ADD CONSTRAINT "NotificationRead_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
