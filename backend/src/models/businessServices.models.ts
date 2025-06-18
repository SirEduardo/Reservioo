import prisma from "../lib/prisma"


export const createServices = async (name: string, duration: number, price: number, companyId: string) => {
    return await prisma.service.create({
        data: {
            name,
            duration,
            price,
            companyId
        }
    })

}

export const getBusinessServices = async  (companyId: string) => {
    const company = await prisma.company.findUnique({ where: { id: companyId } });
    if (!company) throw new Error("Company not found");
    const services = await prisma.service.findMany({
        where: 
        { companyId }
    })
    return services
}

export const updateServices = async (serviceId: string, name: string, duration: number, price: number) => {
    const existingService = await prisma.service.findUnique({ where: { id: serviceId } })
    if (!existingService) throw new Error('Service not found')

    if (isNaN(duration) || isNaN(price)) {
        throw new Error('Duración o precio inválido')
      }
      
    const service = await prisma.service.update({
        where: { id: serviceId },
        data: {
            name: name,
            duration: duration,
            price: price
        }
    })
    return service
}

export const deleteServices = async (serviceId: string) => {
    const existingService = await prisma.service.findUnique({ where: { id: serviceId } })
    if (!existingService) throw new Error('Service not found')
    await prisma.service.delete({ where: { id: serviceId } })
    return { message: 'Service deleted successfully' }
}


export const assignProfessionalsToServices = async (serviceId: string, professionalId: string) => {
    const exists = await prisma.professionalServices.findUnique({
      where: {
        professionalId_serviceId: {
          professionalId,
          serviceId
        }
      }
    })
    if (exists) throw new Error("Professional already assigned to service")
  
    const assignment = await prisma.professionalServices.create({
      data: { serviceId, professionalId }
    })
    return assignment
  }
  
  export const unassingProfessionalFromServices = async (serviceId: string, professionalId: string) => {
    await prisma.professionalServices.delete({
      where: {
        professionalId_serviceId: {
          professionalId,
          serviceId
        }
      }
    })
    return { message: 'Unassign completed' }
  }
  
  export const fetchProfessionalServices = async (companyId: string) => {
    const company = await prisma.company.findUnique({ where: { id: companyId } })
    if (!company) throw new Error("Company not found")
  
    const services = await prisma.professionalServices.findMany({
      where: {
        professional: { companyId }
      },
      select: {
        professionalId: true,
        serviceId: true
      }
    })
  
    return services
  }
  