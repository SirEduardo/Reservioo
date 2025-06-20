-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_professionalId_fkey";

-- DropForeignKey
ALTER TABLE "ProfessionalServices" DROP CONSTRAINT "ProfessionalServices_professionalId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduleProfessional" DROP CONSTRAINT "ScheduleProfessional_professionalId_fkey";

-- AddForeignKey
ALTER TABLE "ScheduleProfessional" ADD CONSTRAINT "ScheduleProfessional_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalServices" ADD CONSTRAINT "ProfessionalServices_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE CASCADE ON UPDATE CASCADE;
