import prisma from "../lib/prisma"
import { calculateSlots } from "../utils/calculateSlots"

export const createSchedules = async (companyId: string, dayOfWeek: number, startTime: string, endTime: string) => {
  const company = await prisma.company.findUnique({ where: {id: companyId} })
  if (!company) throw new Error('company not found')
    const schedule = await prisma.schedule.create({
        data: {
          companyId,
          dayOfWeek,
          startTime,
          endTime
        }
      })
    return schedule
}
export const getSchedules = async (companyId: string) => {
  const company = await prisma.company.findUnique({ where: {id: companyId} })
  if (!company) throw new Error("Company not found")

  const schedules = await prisma.schedule.findMany({ 
    where: { companyId} 
  })

  return schedules
}

export const assignProfessionalsToSchedules = async (scheduleId: string, professionalId: string) => {
  const exists = await prisma.scheduleProfessional.findUnique({
    where: {
      scheduleId_professionalId: {
        scheduleId,
        professionalId
      }
    }
  })
  if (exists) throw new Error("Professional already assigned to service")

  const assignment = await prisma.scheduleProfessional.create({
    data: { scheduleId, professionalId }
  })
  return assignment
}

export const unassingProfessionalFromSchedules = async (scheduleId: string, professionalId: string) => {
  await prisma.scheduleProfessional.delete({
    where: {
      scheduleId_professionalId: {
        professionalId,
        scheduleId
      }
    }
  })
  return { message: 'Unassign completed' }
}

export const fetchProfessionalSchedules = async (companyId: string) => {
  const company = await prisma.company.findUnique({ where: { id: companyId } })
  if (!company) throw new Error("Company not found")

  const services = await prisma.scheduleProfessional.findMany({
    where: {
      professional: { companyId }
    },
    select: {
      professionalId: true,
      scheduleId: true
    }
  })

  return services
}

export const getSchedulesByProfessional  = async(professionalId: string) => {
    const schedule = await prisma.schedule.findMany({
        where: { 
          professionals: {
            some: {
              professionalId
            }
          }
         }
    })
    return schedule
}


export const getProfessionalsBySchedule = async (scheduleId: string) => {
    const scheduleWithProfessionals = await prisma.schedule.findUnique({
        where: { id: scheduleId },
        include: {
            professionals: {
                include: {
                    professional: true
                }
            }
        }
    })
    if (!scheduleWithProfessionals) throw new Error('Schedule not found')

    return scheduleWithProfessionals.professionals.map((sp: any) => sp.professional)
}

export const getAvailableProfessionals = async (date: string, time: string): Promise<string[]> => {
    const targetDate = new Date(`${date}T${time}:00`);
    const dayOfWeek = new Date(date).getDay();
  
    const schedules = await prisma.schedule.findMany({
      where: { dayOfWeek },
      include: {
        professionals: true
      }
    });
  
    const availableProfessionals: string[] = [];
  
    for (const schedule of schedules) {
      const slots = calculateSlots(schedule.startTime, schedule.endTime, 30);
      if (!slots.includes(time)) continue;
  
      for (const sp of schedule.professionals) {
        const existingBooking = await prisma.booking.findFirst({
          where: {
            date: targetDate,
            professionalId: sp.professionalId
          }
        });
  
        if (!existingBooking) {
          availableProfessionals.push(sp.professionalId);
        }
      }
    }
  
    return availableProfessionals;
  };

  export const deleteSchedules = async (scheduleId: string) => {
    const schedule = await prisma.schedule.findUnique({ where: { id: scheduleId } })
    if (!schedule) throw new Error("Schedule not found")
    await prisma.schedule.delete({ where: { id :scheduleId} })
    return { message: "schedule deleted" }
  }
 