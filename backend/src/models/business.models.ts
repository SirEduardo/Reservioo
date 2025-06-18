import prisma from "../lib/prisma"


export const getBusinessConfig = async (id: string) => {
    const business = await prisma.company.findUnique({
        where: 
        { id },
        include: {
            schedules: true,
            services: true,
            professionals: true,
            bookings: true,
        }
    })
    if (!business) throw new Error("Business data not found")

    return business
}



