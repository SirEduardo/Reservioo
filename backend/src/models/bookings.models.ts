import prisma from "../lib/prisma"
import { sendConfirmationBooking } from "../utils/sendConfirmation"

export const getBookingDataBySlug = async (slug: string) => {
  const company = await prisma.company.findUnique({
    where: { slug },
    include: {
      services: true,
      professionals: {
        include: {
          professionalServices: {
            include: {
              service: true
            }
          },
          schedules: {
            include: {
              schedule: true
            }
          }
        }
      },
      settings: true
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
      include: {
        company: true,
        professional: true,
        service: true,
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
