const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createTestData() {
  try {
    console.log('Creando datos de prueba...')

    // 1. Crear una empresa
    const company = await prisma.company.create({
      data: {
        ownerName: 'Marisol',
        email: 'marisol@test.com',
        password: 'password123',
        phone: '123456789',
        businessName: 'Centro de Servicios Profesionales',
        businessType: 'Servicios',
        slug: 'centro-servicios'
      }
    })
    console.log('✅ Empresa creada:', company.id)

    // 2. Crear un profesional
    const professional = await prisma.professional.create({
      data: {
        name: 'Dr. Juan Pérez',
        companyId: company.id
      }
    })
    console.log('✅ Profesional creado:', professional.id)

    // 3. Crear un servicio
    const service = await prisma.service.create({
      data: {
        name: 'Consulta General',
        duration: 30,
        price: 50.0,
        companyId: company.id
      }
    })
    console.log('✅ Servicio creado:', service.id)

    // 4. Crear horarios de trabajo (Lunes a Viernes, 9:00-17:00)
    const schedules = []
    for (let day = 1; day <= 5; day++) {
      // 1 = Lunes, 5 = Viernes
      const schedule = await prisma.schedule.create({
        data: {
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '17:00',
          companyId: company.id
        }
      })
      schedules.push(schedule)
      console.log(`✅ Horario creado para día ${day}:`, schedule.id)
    }

    // 5. Asignar el profesional a todos los horarios
    for (const schedule of schedules) {
      await prisma.scheduleProfessional.create({
        data: {
          scheduleId: schedule.id,
          professionalId: professional.id
        }
      })
      console.log(`✅ Profesional asignado al horario ${schedule.id}`)
    }

    // 6. Asignar el servicio al profesional
    await prisma.professionalServices.create({
      data: {
        professionalId: professional.id,
        serviceId: service.id
      }
    })
    console.log('✅ Servicio asignado al profesional')

    console.log('🎉 Datos de prueba creados exitosamente!')
    console.log('Empresa ID:', company.id)
    console.log('Profesional ID:', professional.id)
    console.log('Servicio ID:', service.id)
  } catch (error) {
    console.error('❌ Error creando datos de prueba:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestData()
