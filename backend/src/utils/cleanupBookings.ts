import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Ejecutar el 1 de cada mes a las 00:10
cron.schedule('10 0 1 * *', async () => {
  const now = new Date();
  const firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  try {
    const result = await prisma.booking.deleteMany({
      where: {
        date: {
          lt: firstDayOfCurrentMonth
        }
      }
    });
    console.log(`[CRON] Reservas eliminadas: ${result.count}`);
  } catch (error) {
    console.error('[CRON] Error al limpiar reservas:', error);
  }
});