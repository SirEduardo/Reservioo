// Interfaces
export interface Professional {
    id: string
    name: string
    companyId: string
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
    date: Date | null
    phone?: string
  }
  
export interface CompanySettings {
    id: string
    companyId: string
    appointmentDuration: number
    appointmentBuffer: number
  }

  export interface TimeSlot {
    time: string
    available: boolean
    professionalId?: string
  }