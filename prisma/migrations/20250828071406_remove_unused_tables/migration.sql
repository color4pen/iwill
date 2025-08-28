/*
  Warnings:

  - You are about to drop the `Attendance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WeddingInfo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_userId_fkey";

-- DropForeignKey
ALTER TABLE "InquiryThread" DROP CONSTRAINT "InquiryThread_userId_fkey";

-- DropTable
DROP TABLE "Attendance";

-- DropTable
DROP TABLE "WeddingInfo";

-- DropEnum
DROP TYPE "AttendanceStatus";

-- DropEnum
DROP TYPE "MediaType";

-- CreateIndex
CREATE INDEX "Notification_category_idx" ON "Notification"("category");

-- AddForeignKey
ALTER TABLE "InquiryThread" ADD CONSTRAINT "InquiryThread_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
