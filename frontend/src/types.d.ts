// Interfaces
export interface Company {
  id: string    
  ownerName: string
  email: string     
  password: string
  phone: string
  name: string
  businessType: string
  slug: string  
}
export interface BusinessInfo {
  company: Company
  professionals: Professional[]
  services: Service[]
  bookings: Booking[]
  businessClosure: BusinessClosure[]
  settings: CompanySettings
}
export interface Professional {
    id: string
    name: string
    companyId: string
    services: Service[]
  }
  
export interface Service {
    id: string
    name: string
    duration: number
    price: number
    companyId: string
  }
export interface Schedule {
    id: string
    dayOfWeek: number
    startTime: string
    endTime: string
    companyId: string
  }
  
export interface ScheduleProfessional {
    scheduleId: string
    professionalId: string
  }
  
export interface ProfessionalServices {
    professionalId: string
    serviceId: string
  }
  
export interface Booking {
    id: string
    companyId: string
    professionalId: string | null
    serviceId: string
    name: string
    email: string
    date: string | Date | null
    phone?: string
  }
  export interface BusinessClosure {
    id: string
    startDate: Date
    endDate: Date
    reason: string
  }
  
export interface CompanySettings {
    id: string
    companyId: string
    appointmentDuration: number
  }

  export interface TimeSlot {
    time: string
    available: boolean
    professionalId?: string
  }

  export type Theme = {
    colors: {
      primary: string
      primaryLight: string
      surface: string
      border: string
      text: string
      textSecondary: string
    }
  }