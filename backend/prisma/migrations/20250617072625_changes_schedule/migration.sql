/*
  Warnings:

  - You are about to drop the column `professionalId` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the `ProfessionalSchedule` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `companyId` on table `Schedule` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ProfessionalSchedule" DROP CONSTRAINT "ProfessionalSchedule_professionalId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_companyId_fkey";

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "professionalId",
ALTER COLUMN "companyId" SET NOT NULL;

-- DropTable
DROP TABLE "ProfessionalSchedule";

-- CreateTable
CREATE TABLE "ScheduleProfessional" (
    "scheduleId" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,

    CONSTRAINT "ScheduleProfessional_pkey" PRIMARY KEY ("scheduleId","professionalId")
);

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleProfessional" ADD CONSTRAINT "ScheduleProfessional_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleProfessional" ADD CONSTRAINT "ScheduleProfessional_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
