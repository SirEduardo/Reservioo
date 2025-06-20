import { format } from 'date-fns-tz'

export function calculateSlots(
  start: string,
  end: string,
  intervalMinutes: number,
  timeZone = 'Europe/Madrid',
  baseDate: Date = new Date()
): string[] {
    const [ startHour, startMin ] = start.split(":").map(Number)
    const [ endHour, endMin ] = end.split(":").map(Number)

    const startDate = new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate(),
        startHour,
        startMin,
        0,
        0
    )
    const endDate = new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate(),
        endHour,
        endMin,
        0,
        0
    )

    const slots: string[] = []
    let current = new Date(startDate)

    while (current < endDate) {
        slots.push(format(current, 'HH:mm', { timeZone }))
        current = new Date(current.getTime() + intervalMinutes * 60000)
    }
    return slots
}