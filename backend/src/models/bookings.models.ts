import prisma from "../lib/prisma"
import { sendConfirmationBooking } from "../utils/sendConfirmation"

export const getBookingDataBySlug = async (slug: string) => {
  const company = await prisma.company.findUnique({
    where: { slug },
    select: {
      id: true,
      businessName: true,
      settings: {
        select:{
          appointmentDuration: true,
        }
      },
      services: {
        select: { id: true, name: true, duration: true, price: true }
      },
      professionals: {
        select: { 
          id: true, 
          name: true,
          professionalServices: {
            select: {
              service:{ select: { id: true, name: true }}
            }
          },
          schedules: {
            select: {
              schedule: { select: { dayOfWeek: true, startTime: true, endTime: true }}
            }
          }
        }
      }
    }
  })

  if (!company) throw new Error("Company not found")

  return company
}

export const createBookings = async(companyId: string, professionalId: string, serviceId: string, name: string, email: string, phone: string, date: string) => {
  const dateObj = new Date(date)
  if (isNaN(dateObj.getTime())) {
    throw new Error("Fecha inválida")
  }
  if (!/\S+@\S+\.\S+/.test(email)) throw new Error("Email inválido");
  if (!/^\+?\d{5,15}$/.test(phone)) throw new Error("Teléfono inválido");
  const [company, professional, service] = await Promise.all([
    prisma.company.findUnique({ where: { id: companyId } }),
    prisma.professional.findUnique({ where: { id: professionalId } }),
    prisma.service.findUnique({ where: { id: serviceId } }),
  ])

  if (!company) throw new Error("Company not found")
  if (!professional) throw new Error("Professional not found")
  if (!service) throw new Error("Service not found")


    const booking = await prisma.booking.create({
      data: {
        companyId,
        professionalId,
        serviceId,
        name,
        email,
        phone,
        date: dateObj,
      },
      select: {
        id: true,
        date: true,
        name: true,
        email: true,
        phone: true,
        company:{
          select: { id:true, businessName:true }
        },
        professional: { select: { id: true, name: true } },
        service: { select: { id: true, name: true, price: true } }
      }
    })
    await sendConfirmationBooking({ booking, company: booking.company })
    return booking
}

export const getBookings = async(companyId: string) => {
    const company = await prisma.company.findUnique({ where: { id: companyId } })
    if (!company) throw new Error("Company not found");
    const bookings = await prisma.booking.findMany({ where: { companyId: companyId } })
    if (!bookings) throw new Error('Bookings not found')
    return bookings
}

export const getBookingsById = async(id: string) => {
    const booking = await prisma.booking.findUnique({ where: { id: id } })
    if (!booking) throw new Error('Booking not found')
    return booking
}

export const deleteBookings = async(id: string) => {
    const existingBooking = await prisma.booking.findUnique({ where: { id: id } })
    if (!existingBooking) throw new Error('Booking not found')
    await prisma.booking.delete({ where: { id: id } })
    return { message: 'Booking deleted successfully' }
}
