-- AlterTable: Rename url column to fileUrl
ALTER TABLE "Media" RENAME COLUMN "url" TO "fileUrl";

-- AlterTable: Add missing columns to Media
ALTER TABLE "Media" ADD COLUMN "fileName" TEXT NOT NULL DEFAULT 'unknown';
ALTER TABLE "Media" ADD COLUMN "fileSize" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Media" ADD COLUMN "mimeType" TEXT NOT NULL DEFAULT 'application/octet-stream';
ALTER TABLE "Media" ADD COLUMN "approvedAt" TIMESTAMP(3);
ALTER TABLE "Media" ADD COLUMN "approvedBy" TEXT;

-- DropColumn: Remove unnecessary columns
ALTER TABLE "Media" DROP COLUMN "type";
ALTER TABLE "Media" DROP COLUMN "uploadedAt";

-- CreateIndex: Add missing indexes
CREATE INDEX "Media_createdAt_idx" ON "Media"("createdAt");

-- Update default values for better data integrity
ALTER TABLE "Media" ALTER COLUMN "fileName" DROP DEFAULT;
ALTER TABLE "Media" ALTER COLUMN "fileSize" DROP DEFAULT;
ALTER TABLE "Media" ALTER COLUMN "mimeType" DROP DEFAULT;