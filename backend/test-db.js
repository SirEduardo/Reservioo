const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testDatabase() {
  try {
    console.log('Conectando a la base de datos...')

    // Verificar conexión
    await prisma.$connect()
    console.log('✅ Conexión exitosa')

    // Verificar si hay schedules
    const schedules = await prisma.schedule.findMany()
    console.log('📅 Schedules encontrados:', schedules.length)
    console.log('Schedules:', schedules)

    // Verificar si hay profesionales
    const professionals = await prisma.professional.findMany()
    console.log('👥 Profesionales encontrados:', professionals.length)
    console.log('Profesionales:', professionals)

    // Verificar si hay ScheduleProfessional
    const scheduleProfessionals = await prisma.scheduleProfessional.findMany()
    console.log(
      '🔗 ScheduleProfessional encontrados:',
      scheduleProfessionals.length
    )
    console.log('ScheduleProfessional:', scheduleProfessionals)

    // Verificar si hay bookings
    const bookings = await prisma.booking.findMany()
    console.log('📋 Bookings encontrados:', bookings.length)
    console.log('Bookings:', bookings)
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testDatabase()
