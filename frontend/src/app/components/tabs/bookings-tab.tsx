'use client'

import { useState } from 'react'
import { format, isSameMonth, addMonths, subMonths } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  Calendar,
  Clock,
  Mail,
  Trash2,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import { useProfessionals } from '@/context/professionals-context'
import { useService } from '@/context/services-context'
import { useBookings } from '@/context/bookings-context'

export default function BookingTab() {
  const { professionals } = useProfessionals()
  const { services } = useService()
  const { bookings, handleDeleteBooking, fetchBookings, loading, error } =
    useBookings()

  const [mesSeleccionado, setMesSeleccionado] = useState(new Date())
  const esMesActual = isSameMonth(mesSeleccionado, new Date())

  const nextBookings = bookings.filter(
    (booking) => booking.date && booking.date >= new Date()
  )
  const reservasDelMes = nextBookings.filter(
    (booking) => booking.date && isSameMonth(booking.date, mesSeleccionado)
  )

  const cambiarMes = (direccion: 'anterior' | 'siguiente') => {
    if (direccion === 'anterior') {
      setMesSeleccionado(subMonths(mesSeleccionado, 1))
    } else {
      setMesSeleccionado(addMonths(mesSeleccionado, 1))
    }
  }

  const volverMesActual = () => {
    setMesSeleccionado(new Date())
  }

  const getProfessionalName = (professionalId: string | null) => {
    if (!professionalId) return 'Cualquier profesional'
    return (
      professionals.find((p) => p.id === professionalId)?.name || 'Desconocido'
    )
  }

  const getServiceName = (serviceId: string) => {
    return services.find((s) => s.id === serviceId)?.name || 'Desconocido'
  }

  const getServicePrice = (serviceId: string) => {
    return services.find((s) => s.id === serviceId)?.price || 0
  }

  // Loading state
  if (loading) {
    return (
      <section>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando reservas...</p>
          </div>
        </div>
      </section>
    )
  }

  // Error state
  if (error) {
    return (
      <section>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 font-medium mb-2">
              Error al cargar reservas
            </p>
            <button
              onClick={fetchBookings}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section>
      {/* Selector de mes */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 p-4 sm:p-6 bg-gray-50 rounded-lg gap-4 sm:gap-0 border border-gray-200">
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={() => cambiarMes('anterior')}
            className="p-3 sm:p-2 hover:bg-white rounded-lg transition-colors touch-manipulation"
            aria-label="Mes anterior"
          >
            <svg
              className="h-5 w-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="text-center min-w-0 flex-1 sm:flex-initial">
            <h3 className="text-lg sm:text-lg font-semibold text-gray-900 truncate">
              {format(mesSeleccionado, 'MMMM yyyy', { locale: es })}
            </h3>
            {!esMesActual && (
              <button
                onClick={volverMesActual}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors mt-1"
              >
                Volver al mes actual
              </button>
            )}
          </div>

          <button
            onClick={() => cambiarMes('siguiente')}
            className="p-3 sm:p-2 hover:bg-white rounded-lg transition-colors touch-manipulation"
            aria-label="Mes siguiente"
          >
            <svg
              className="h-5 w-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 sm:gap-4">
          {esMesActual && (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
              Mes actual
            </span>
          )}
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
            {reservasDelMes.length} reservas
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Reservas de {format(mesSeleccionado, 'MMMM', { locale: es })}
        </h2>
        <button
          onClick={fetchBookings}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Actualizar
        </button>
      </div>

      <div className="space-y-4">
        {reservasDelMes
          .sort((a, b) => {
            const aTime =
              a.date instanceof Date
                ? a.date.getTime()
                : new Date(a.date as string).getTime()
            const bTime =
              b.date instanceof Date
                ? b.date.getTime()
                : new Date(b.date as string).getTime()
            return aTime - bTime
          })
          .map((booking) => (
            <div
              key={booking.id}
              className="p-5 sm:p-6 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300 bg-white hover:bg-gray-50"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
                  <div className="bg-blue-100 text-blue-700 h-12 w-12 sm:h-14 sm:w-14 rounded-lg flex items-center justify-center font-bold text-lg sm:text-xl flex-shrink-0">
                    {booking.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex relative">
                      <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                        {booking.name}
                      </p>
                      <button
                        onClick={() => handleDeleteBooking(booking.id)}
                        className={`block sm:hidden absolute right-0 top-0 rounded-lg ${'text-red-500'}`}
                        aria-label="Eliminar reserva"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mt-1">
                      <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">{booking.email}</span>
                    </div>
                    {booking.phone && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mt-1">
                        <span className="truncate">📞 {booking.phone}</span>
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                      <span className="text-xs sm:text-sm bg-green-100 text-green-800 px-3 py-1 rounded-lg inline-block font-medium">
                        {getServiceName(booking.serviceId)}
                      </span>
                      <span className="text-xs sm:text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-lg inline-block font-medium">
                        {getProfessionalName(booking.professionalId)}
                      </span>
                      <span className="text-m font-semibold text-green-600 sm:block hidden">
                        {getServicePrice(booking.serviceId)}€
                      </span>
                    </div>
                    <div className="sm:hidden flex items-center justify-between pt-2">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.date
                          ? format(booking.date, 'EEEE, d MMMM', { locale: es })
                          : 'Fecha no definida'}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-1 sm:justify-end">
                        <Clock className="h-3 w-3" />
                        {(() => {
                          if (!booking.date) return 'Hora no definida'
                          if (typeof booking.date === 'string')
                            return booking.date.slice(11, 16)
                          if (booking.date instanceof Date)
                            return booking.date.toISOString().slice(11, 16)
                          return String(booking.date).slice(11, 16)
                        })()}
                      </div>
                      <span className="text-m font-semibold text-green-600 ml-2">
                        {getServicePrice(booking.serviceId)}€
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-4">
                  <div className="text-left sm:text-right hidden sm:block">
                    <div className="text-sm font-medium text-gray-900">
                      {booking.date
                        ? format(booking.date, 'EEEE, d MMMM', { locale: es })
                        : 'Fecha no definida'}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center gap-1 sm:justify-end">
                      <Clock className="h-3 w-3" />
                      {(() => {
                        if (!booking.date) return 'Hora no definida'
                        if (typeof booking.date === 'string')
                          return booking.date.slice(11, 16)
                        if (booking.date instanceof Date)
                          return booking.date.toISOString().slice(11, 16)
                        return String(booking.date).slice(11, 16)
                      })()}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteBooking(booking.id)}
                    className={`hidden sm:block p-3 rounded-lg transition-all duration-300 cursor-pointer ${'text-red-500 hover:bg-red-50'}`}
                    aria-label="Eliminar reserva"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

        {reservasDelMes.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">
              No hay reservas en{' '}
              {format(mesSeleccionado, 'MMMM yyyy', { locale: es })}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {esMesActual
                ? 'Las reservas aparecerán aquí cuando los clientes las realicen'
                : 'Navega a otros meses para ver más reservas'}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
