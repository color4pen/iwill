-- DropIndex
DROP INDEX "Schedule_order_idx";

-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "date" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Schedule_date_time_order_idx" ON "Schedule"("date", "time", "order");
