-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "mediaSituationId" TEXT;

-- CreateTable
CREATE TABLE "MediaSituation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaSituation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MediaSituation_order_idx" ON "MediaSituation"("order");

-- CreateIndex
CREATE INDEX "MediaSituation_isActive_idx" ON "MediaSituation"("isActive");

-- CreateIndex
CREATE INDEX "Media_mediaSituationId_idx" ON "Media"("mediaSituationId");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_mediaSituationId_fkey" FOREIGN KEY ("mediaSituationId") REFERENCES "MediaSituation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
