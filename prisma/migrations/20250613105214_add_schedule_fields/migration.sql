/*
  Warnings:

  - You are about to drop the column `event` on the `Schedule` table. All the data in the column will be lost.
  - Added the required column `title` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "event",
ADD COLUMN     "colorBg" TEXT NOT NULL DEFAULT 'bg-gray-100',
ADD COLUMN     "colorText" TEXT NOT NULL DEFAULT 'text-gray-600',
ADD COLUMN     "icon" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Schedule_isActive_idx" ON "Schedule"("isActive");
