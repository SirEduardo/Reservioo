const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testAvailability() {
  try {
    console.log('Verificando datos en la base de datos...')

    // Verificar si hay horarios
    const schedules = await prisma.schedule.findMany({
      include: {
        professionals: true
      }
    })

    console.log('Horarios encontrados:', schedules.length)
    schedules.forEach((schedule) => {
      console.log(
        `- Día ${schedule.dayOfWeek}: ${schedule.startTime} - ${schedule.endTime} (${schedule.professionals.length} profesionales)`
      )
    })

    // Verificar si hay profesionales
    const professionals = await prisma.professional.findMany()
    console.log('Profesionales encontrados:', professionals.length)

    // Verificar si hay empresas
    const companies = await prisma.company.findMany()
    console.log('Empresas encontradas:', companies.length)

    // Si no hay horarios, crear algunos de prueba
    if (schedules.length === 0) {
      console.log('Creando horarios de prueba...')

      // Crear una empresa de prueba si no existe
      let company = await prisma.company.findFirst()
      if (!company) {
        company = await prisma.company.create({
          data: {
            name: 'Empresa de Prueba',
            slug: 'empresa-prueba'
          }
        })
        console.log('Empresa creada:', company.id)
      }

      // Crear profesionales de prueba si no existen
      let professional1 = await prisma.professional.findFirst()
      if (!professional1) {
        professional1 = await prisma.professional.create({
          data: {
            name: 'Ana García',
            email: 'ana@test.com'
          }
        })
        console.log('Profesional 1 creado:', professional1.id)
      }

      let professional2 = await prisma.professional.findFirst({
        where: {
          id: { not: professional1.id }
        }
      })
      if (!professional2) {
        professional2 = await prisma.professional.create({
          data: {
            name: 'Carlos López',
            email: 'carlos@test.com'
          }
        })
        console.log('Profesional 2 creado:', professional2.id)
      }

      // Crear horarios para lunes a viernes
      const daysOfWeek = [1, 2, 3, 4, 5] // Lunes a Viernes

      for (const dayOfWeek of daysOfWeek) {
        const schedule = await prisma.schedule.create({
          data: {
            dayOfWeek,
            startTime: '09:00',
            endTime: '18:00',
            companyId: company.id
          }
        })

        // Asignar profesionales al horario
        await prisma.scheduleProfessional.create({
          data: {
            scheduleId: schedule.id,
            professionalId: professional1.id
          }
        })

        await prisma.scheduleProfessional.create({
          data: {
            scheduleId: schedule.id,
            professionalId: professional2.id
          }
        })

        console.log(`Horario creado para día ${dayOfWeek}: ${schedule.id}`)
      }

      console.log('Horarios de prueba creados exitosamente')
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAvailability()
