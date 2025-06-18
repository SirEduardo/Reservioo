/*
  Warnings:

  - You are about to drop the `_ProfessionalServices` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProfessionalServices" DROP CONSTRAINT "_ProfessionalServices_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProfessionalServices" DROP CONSTRAINT "_ProfessionalServices_B_fkey";

-- DropTable
DROP TABLE "_ProfessionalServices";

-- CreateTable
CREATE TABLE "ProfessionalServices" (
    "professionalId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "ProfessionalServices_pkey" PRIMARY KEY ("professionalId","serviceId")
);

-- AddForeignKey
ALTER TABLE "ProfessionalServices" ADD CONSTRAINT "ProfessionalServices_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalServices" ADD CONSTRAINT "ProfessionalServices_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
