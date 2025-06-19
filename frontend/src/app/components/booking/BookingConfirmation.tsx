'use client'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CheckCircle, Briefcase, User, Calendar, Mail } from 'lucide-react'
import { ThemedButton } from '../themed/button'
import { Service, Professional } from '@/types'

interface BookingConfirmationProps {
  bookingData: {
    name: string
    email: string
    phone?: string
    date: Date | null
  }
  selectedService: Service | undefined
  selectedProfessional: Professional | null | undefined
  onNewBooking: () => void
  currentTheme: any
}

export function BookingConfirmation({
  bookingData,
  selectedService,
  selectedProfessional,
  onNewBooking,
  currentTheme
}: BookingConfirmationProps) {
  const formatDate = (date: Date) => {
    return format(date, "EEEE, d 'de' MMMM", { locale: es })
  }

  const getTimeFromDate = (date: Date) => {
    return format(date, 'HH:mm')
  }

  return (
    <div className="text-center py-12 px-6">
      <div className="flex justify-center mb-6">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ backgroundColor: currentTheme.colors.primaryLight }}
        >
          <CheckCircle
            className="h-10 w-10"
            style={{ color: currentTheme.colors.primary }}
          />
        </div>
      </div>

      <h2
        className="text-3xl font-bold mb-4"
        style={{ color: currentTheme.colors.text }}
      >
        ¡Reserva confirmada!
      </h2>

      <p
        className="text-lg mb-8"
        style={{ color: currentTheme.colors.textSecondary }}
      >
        Hemos enviado los detalles de tu cita a{' '}
        <strong>{bookingData.email}</strong>
      </p>

      <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
        <h3
          className="font-semibold mb-4 text-center"
          style={{ color: currentTheme.colors.text }}
        >
          Detalles de tu cita
        </h3>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Briefcase
              className="h-5 w-5 mt-0.5"
              style={{ color: currentTheme.colors.primary }}
            />
            <div>
              <div
                className="font-medium"
                style={{ color: currentTheme.colors.text }}
              >
                {selectedService?.name}
              </div>
              <div
                className="text-sm"
                style={{ color: currentTheme.colors.textSecondary }}
              >
                {selectedService?.duration} minutos • {selectedService?.price}€
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <User
              className="h-5 w-5 mt-0.5"
              style={{ color: currentTheme.colors.primary }}
            />
            <div>
              <div
                className="font-medium"
                style={{ color: currentTheme.colors.text }}
              >
                {selectedProfessional?.name ||
                  'Cualquier profesional disponible'}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar
              className="h-5 w-5 mt-0.5"
              style={{ color: currentTheme.colors.primary }}
            />
            <div>
              <div
                className="font-medium"
                style={{ color: currentTheme.colors.text }}
              >
                {bookingData.date && formatDate(bookingData.date)}
              </div>
              <div
                className="text-sm"
                style={{ color: currentTheme.colors.textSecondary }}
              >
                {bookingData.date && getTimeFromDate(bookingData.date)}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail
              className="h-5 w-5 mt-0.5"
              style={{ color: currentTheme.colors.primary }}
            />
            <div>
              <div
                className="font-medium"
                style={{ color: currentTheme.colors.text }}
              >
                {bookingData.name}
              </div>
              <div
                className="text-sm"
                style={{ color: currentTheme.colors.textSecondary }}
              >
                {bookingData.email} • {bookingData.phone}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ThemedButton onClick={onNewBooking} className="w-full sm:w-auto">
        Realizar otra reserva
      </ThemedButton>
    </div>
  )
}
