import { Booking, TimeSlot } from '@/types'
import { useEffect, useState } from 'react'
import { apiUrl } from '../api/apiUrl'

export function useAvailability(
  bookingData: Booking,
  currentMonth: number,
  currentYear: number
) {
  const [availableDates, setAvailableDates] = useState<Date[]>([])
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)

  useEffect(() => {
    const fetchAvailableDates = async () => {
      if (!bookingData.serviceId) return
      let url = `${apiUrl}/availability/days`
      if (bookingData.professionalId) {
        url += `/${bookingData.professionalId}`
      }
      url += `?month=${currentMonth}&year=${currentYear}`
      url += `&serviceId=${bookingData.serviceId}`
      const res = await fetch(url)
      const dates = await res.json()
      setAvailableDates(dates.map((d: string) => new Date(d)))
    }
    fetchAvailableDates()
  }, [
    bookingData.serviceId,
    bookingData.professionalId,
    currentMonth,
    currentYear
  ])

  // Cargar horarios disponibles cuando se selecciona una fecha
  useEffect(() => {
    if (!bookingData.date) return
    const fetchAvailableHours = async () => {
      setIsLoadingSlots(true)
      try {
        const dateStr = bookingData.date
          ? new Date(bookingData.date).toISOString().split('T')[0]
          : ''
        let url = `${apiUrl}/availability/hours`
        if (bookingData.professionalId) {
          url += `/${bookingData.professionalId}`
        }
        url += `?date=${dateStr}&serviceId=${bookingData.serviceId}`
        const res = await fetch(url)
        const times = await res.json()
        setAvailableSlots(
          times.map((t: string) => ({ time: t, available: true }))
        )
      } catch {
        console.error('Error al obtener horarios')
      } finally {
        setIsLoadingSlots(false)
      }
    }
    fetchAvailableHours()
  }, [bookingData.date, bookingData.professionalId, bookingData.serviceId])

  const fetchAvailableProfessional = async (date: Date, time: string) => {
    const dateStr = date.toISOString().split('T')[0]
    const res = await fetch(
      `${apiUrl}/availability/professionals?date=${dateStr}&time=${time}`
    )
    return await res.json()
  }

  return {
    availableSlots,
    availableDates,
    isLoadingSlots,
    fetchAvailableProfessional
  }
}
