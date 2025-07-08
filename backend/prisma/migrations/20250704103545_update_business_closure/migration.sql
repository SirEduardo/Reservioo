/*
  Warnings:

  - You are about to drop the column `date` on the `BusinessClosure` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[companyId,startDate,endDate]` on the table `BusinessClosure` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `endDate` to the `BusinessClosure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `BusinessClosure` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "BusinessClosure_companyId_date_key";

-- AlterTable
ALTER TABLE "BusinessClosure" DROP COLUMN "date",
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BusinessClosure_companyId_startDate_endDate_key" ON "BusinessClosure"("companyId", "startDate", "endDate");
