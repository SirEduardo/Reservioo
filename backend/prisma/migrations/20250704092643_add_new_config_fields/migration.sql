-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "maxBookingTimeAhead" INTEGER,
ADD COLUMN     "minBookingTimeAhead" INTEGER;

-- CreateTable
CREATE TABLE "BusinessClosure" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "isHalfDay" BOOLEAN,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "BusinessClosure_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessClosure_companyId_date_key" ON "BusinessClosure"("companyId", "date");

-- AddForeignKey
ALTER TABLE "BusinessClosure" ADD CONSTRAINT "BusinessClosure_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
