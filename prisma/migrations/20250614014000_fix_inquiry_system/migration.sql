-- Create new enum type with correct name
CREATE TYPE "MessageSenderRole" AS ENUM ('USER', 'ADMIN');

-- Add missing columns to InquiryMessage
ALTER TABLE "InquiryMessage" ADD COLUMN "senderId" TEXT NOT NULL DEFAULT '';
ALTER TABLE "InquiryMessage" ADD COLUMN "senderName" TEXT NOT NULL DEFAULT '';
ALTER TABLE "InquiryMessage" ADD COLUMN "readAt" TIMESTAMP(3);

-- Change column type from SenderRole to MessageSenderRole
ALTER TABLE "InquiryMessage" 
  ALTER COLUMN "senderRole" TYPE "MessageSenderRole" 
  USING "senderRole"::text::"MessageSenderRole";

-- Drop the old enum type
DROP TYPE "SenderRole";

-- Create missing indexes
CREATE INDEX "InquiryMessage_createdAt_idx" ON "InquiryMessage"("createdAt");
CREATE INDEX "InquiryThread_createdAt_idx" ON "InquiryThread"("createdAt");

-- Remove defaults after adding columns
ALTER TABLE "InquiryMessage" ALTER COLUMN "senderId" DROP DEFAULT;
ALTER TABLE "InquiryMessage" ALTER COLUMN "senderName" DROP DEFAULT;