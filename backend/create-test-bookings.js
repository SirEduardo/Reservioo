const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createTestBookings() {
  try {
    console.log('Creando reservas de prueba...')

    // Get the first company
    const company = await prisma.company.findFirst()
    if (!company) {
      console.log(
        '❌ No se encontró ninguna empresa. Ejecuta primero create-test-data.js'
      )
      return
    }

    // Get the first professional
    const professional = await prisma.professional.findFirst({
      where: { companyId: company.id }
    })
    if (!professional) {
      console.log('❌ No se encontró ningún profesional')
      return
    }

    // Get the first service
    const service = await prisma.service.findFirst({
      where: { companyId: company.id }
    })
    if (!service) {
      console.log('❌ No se encontró ningún servicio')
      return
    }

    console.log('✅ Usando empresa:', company.id)
    console.log('✅ Usando profesional:', professional.id)
    console.log('✅ Usando servicio:', service.id)

    // Create test bookings for different dates
    const testBookings = [
      {
        name: 'María García',
        email: 'maria@test.com',
        phone: '123456789',
        date: new Date(2025, 0, 15, 10, 0), // January 15, 2025 at 10:00
        professionalId: professional.id,
        serviceId: service.id,
        companyId: company.id
      },
      {
        name: 'Carlos López',
        email: 'carlos@test.com',
        phone: '987654321',
        date: new Date(2025, 0, 16, 14, 30), // January 16, 2025 at 14:30
        professionalId: professional.id,
        serviceId: service.id,
        companyId: company.id
      },
      {
        name: 'Ana Martínez',
        email: 'ana@test.com',
        phone: '555666777',
        date: new Date(2025, 0, 17, 9, 0), // January 17, 2025 at 9:00
        professionalId: professional.id,
        serviceId: service.id,
        companyId: company.id
      },
      {
        name: 'Luis Rodríguez',
        email: 'luis@test.com',
        phone: '111222333',
        date: new Date(2025, 0, 20, 11, 0), // January 20, 2025 at 11:00
        professionalId: professional.id,
        serviceId: service.id,
        companyId: company.id
      },
      {
        name: 'Sofia Pérez',
        email: 'sofia@test.com',
        phone: '444555666',
        date: new Date(2025, 0, 22, 16, 0), // January 22, 2025 at 16:00
        professionalId: professional.id,
        serviceId: service.id,
        companyId: company.id
      }
    ]

    for (const bookingData of testBookings) {
      const booking = await prisma.booking.create({
        data: bookingData
      })
      console.log(
        `✅ Reserva creada: ${
          booking.name
        } - ${booking.date.toLocaleDateString()}`
      )
    }

    console.log('🎉 Reservas de prueba creadas exitosamente!')
    console.log('Empresa ID para usar en el dashboard:', company.id)
  } catch (error) {
    console.error('❌ Error creando reservas de prueba:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestBookings()
