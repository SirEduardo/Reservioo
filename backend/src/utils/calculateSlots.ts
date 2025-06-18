

export function calculateSlots(start: string, end: string, intervalMinutes: number): string[] {
    
    const [ startHour, startMin ] = start.split(":").map(Number)
    const [ endHour, endMin ] = end.split(":").map(Number)

    const slots: string[] = []
    
    const current = new Date()
    current.setHours(startHour, startMin, 0, 0)

    const endTime = new Date()
    endTime.setHours(endHour, endMin, 0, 0)

    while (current < endTime) {
        slots.push(current.toTimeString().slice(0, 5))
        current.setMinutes(current.getMinutes() + intervalMinutes)
    }
    return slots
}