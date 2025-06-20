import { toZonedTime, format } from 'date-fns-tz'

export function calculateSlots(start: string, end: string, intervalMinutes: number, timeZone = 'Europe/Madrid'): string[] {
    const [ startHour, startMin ] = start.split(":").map(Number)
    const [ endHour, endMin ] = end.split(":").map(Number)

    const today = new Date()
    // Crear la fecha base en la zona horaria deseada
    const startDate = toZonedTime(new Date(today.setHours(startHour, startMin, 0, 0)), timeZone)
    const endDate = toZonedTime(new Date(today.setHours(endHour, endMin, 0, 0)), timeZone)

    const slots: string[] = []
    let current = new Date(startDate)

    while (current < endDate) {
        slots.push(format(current, 'HH:mm', { timeZone }))
        current = new Date(current.getTime() + intervalMinutes * 60000)
    }
    return slots
}