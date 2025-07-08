import prisma from "../lib/prisma"


export const getBusinessConfig = async (id: string) => {
    const business = await prisma.company.findUnique({
        where: { id },
        select: {
            slug: true,
                services: { select: { id: true}},
                professionals: { select: { id: true}},
                bookings: { select: { id: true, date: true}},
                businessClosure: true  
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

export const addBusinessClosure = async  (companyId: string, startDate: Date, endDate: Date, reason: string) => {
    const existingClosure = await prisma.businessClosure.findFirst({
        where: {
            companyId,
            startDate: {lte: endDate},
            endDate: {gte: startDate}
        }
    })

    if (existingClosure) throw new Error('El período de cierre ya existe')
    
    const newClosure = await prisma.businessClosure.create({
        data: {
            companyId,
            startDate,
            endDate,
            reason
        }
    })
    return newClosure
}

export const deleteBusinessClosure = async (closureId: string) => {
    const closure = await prisma.businessClosure.findUnique({ where: { id: closureId } })
    if (!closure) throw new Error('Horario de cierre no encontrado')

    await prisma.businessClosure.delete({ where: { id: closureId } })
    return { message: 'Horario eliminado correctamente' }
}



