import prisma from "../lib/prisma"

export const createProfessionals = async(name: string, companyId: string) => {
    if (!name || !name.trim()) {
        throw new Error("Professional name is required")
      }
    const company = await prisma.company.findUnique({ where: { id: companyId } });
    if (!company) throw new Error('Company not found')
    const professional = await prisma.professional.create({
        data: {
            name: name.trim(),
            companyId
        }
    })
    
    return professional
}

export const getProfessionals = async(companyId: string) => {
    const company = await prisma.company.findUnique({ where: { id: companyId } });
    if (!company) throw new Error("Company not found");

    const professionals = await prisma.professional.findMany({
        where: {
            companyId
        },
        include: {
            professionalServices: true,
            schedules: true,
            bookings: true,
        }
    })
    return professionals
}
export const getProfessionalsById = async(professionalId: string) => {
    const professional = await prisma.professional.findUnique({
        where: { id: professionalId },
        include: {
            schedules: true,
            bookings: true,
            professionalServices: {
                include: {
                    service: true
                }
            }
        }
    })
    if (!professional) throw new Error('Professional not found')
    return professional
}

export const deleteProfessionals = async(professionalId: string) => {
    const existingProfessional = await prisma.professional.findUnique({ where: { id: professionalId } })
    if (!existingProfessional) throw new Error('Professional not found')
    await prisma.professional.delete({ where: { id: professionalId } })
    return { message: 'Professional deleted successfully' }
}