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

export const updateBusinessSlug = async (companyId: string, newSlug: string) => {
    // Verificar unicidad
    const existing = await prisma.company.findUnique({ where: { slug: newSlug } })
    if (existing) throw new Error('El slug ya está en uso')
    // Actualizar slug
    const updated = await prisma.company.update({
        where: { id: companyId },
        data: { slug: newSlug }
    })
    return updated
}



