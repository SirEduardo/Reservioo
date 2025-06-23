import { Calendar, Users, Briefcase, AlarmClock, Settings } from 'lucide-react'


export const DAYS_OF_WEEK = [
    { value: 0, label: "Domingo" },
    { value: 1, label: "Lunes" },
    { value: 2, label: "Martes" },
    { value: 3, label: "Miércoles" },
    { value: 4, label: "Jueves" },
    { value: 5, label: "Viernes" },
    { value: 6, label: "Sábado" },
  ]
  
  export const tabs = [
    { id: 'reservas', label: 'Reservas', icon: Calendar },
    { id: 'professionals', label: 'Profesionales', icon: Users },
    { id: 'services', label: 'Servicios', icon: Briefcase },
    { id: 'schedules', label: 'Horarios', icon: AlarmClock },
    { id: 'settings', label: 'Configuración', icon: Settings }
  ]
