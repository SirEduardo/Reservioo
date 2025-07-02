'use client'

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer
} from 'react'
import { useDashboard } from './dashboard-Context'
import { apiUrl } from '@/app/api/apiUrl'
import { Booking } from '@/types'
import { CrudReducer } from '@/app/reducer/crudReducer'

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

  const [state, dispatch] = useReducer(CrudReducer<Booking>, {
    items: [],
    loading: false,
    error: null
  })

  const fetchBookings = async () => {
    if (!companyId) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'No se ha identificado la empresa'
      })
      dispatch({ type: 'SET_LOADING', payload: false })
      return
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })

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

      dispatch({ type: 'SET_ITEMS', payload: bookingsWithDates })
    } catch (err) {
      console.error('Error fetching bookings:', err)
      dispatch({
        type: 'SET_ERROR',
        payload: 'Error desconocido al cargar reservas'
      })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
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
      dispatch({ type: 'REMOVE_ITEMS', payload: bookingId })
    } catch (err) {
      console.error('Error deleting booking:', err)
      dispatch({ type: 'SET_ERROR', payload: 'Error al eliminar la reserva' })
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [companyId])

  const { loading, error, items: bookings } = state

  return (
    <BookingsContext.Provider
      value={{ bookings, handleDeleteBooking, fetchBookings, error, loading }}
    >
      {children}
    </BookingsContext.Provider>
  )
}
