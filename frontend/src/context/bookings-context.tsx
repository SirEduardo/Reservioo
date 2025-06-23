'use client'

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'
import { useDashboard } from './dashboard-Context'
import { apiUrl } from '@/app/api/apiUrl'
import { Booking } from '@/types'

type BookingsContextProps = {
  bookings: Booking[]
  error: string | null
  loading: boolean
  handleDeleteBooking: (id: string) => Promise<void>
  fetchBookings: () => Promise<void>
}

const BookingsContext = createContext<BookingsContextProps | undefined>(
  undefined
)

export const useBookings = () => {
  const context = useContext(BookingsContext)
  if (!context) throw new Error('useBookings debe usarse dentro de un provider')
  return context
}

export const BookingsProvider = ({
  children,
  companyId: companyIdProp
}: {
  children: ReactNode
  companyId?: string
}) => {
  const dashboard = useDashboard()
  const companyId =
    typeof companyIdProp === 'string' && companyIdProp
      ? companyIdProp
      : dashboard?.companyId

  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBookings = async () => {
    if (!companyId) {
      setError('No se ha identificado la empresa')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${apiUrl}/bookings/${companyId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Error al cargar reservas: ${response.status}`)
      }

      const data = await response.json()

      // Convert date strings to Date objects
      const bookingsWithDates = data.map((booking: Booking) => ({
        ...booking,
        date: booking.date ? new Date(booking.date) : null
      }))

      setBookings(bookingsWithDates)
    } catch (err) {
      console.error('Error fetching bookings:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Error desconocido al cargar reservas'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`${apiUrl}/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Error al eliminar reserva: ${response.status}`)
      }

      // Remove from local state
      setBookings((prev) => prev.filter((booking) => booking.id !== bookingId))
    } catch (err) {
      console.error('Error deleting booking:', err)
      setError(
        err instanceof Error ? err.message : 'Error al eliminar la reserva'
      )
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [companyId])

  return (
    <BookingsContext.Provider
      value={{ bookings, handleDeleteBooking, fetchBookings, error, loading }}
    >
      {children}
    </BookingsContext.Provider>
  )
}
