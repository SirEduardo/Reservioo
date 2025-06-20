'use client'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronLeft, Briefcase, User, Calendar } from 'lucide-react'
import { ThemedButton } from '../themed/button'
import { ThemedInput } from '../themed/input'
import { Service, Professional } from '@/types'

// Definir tipo Theme mínimo
export type Theme = {
  colors: {
    primary: string
    primaryLight: string
    surface: string
    border: string
    text: string
    textSecondary: string
  }
}

interface PersonalDataFormProps {
  bookingData: {
    name: string
    email: string
    phone?: string
    date: Date | null
    serviceId: string
    professionalId: string | null
  }
  selectedService: Service | undefined
  selectedProfessional: Professional | null | undefined
  isLoading: boolean
  onInputChange: (field: string, value: string) => void
  onSubmit: (e: React.FormEvent) => void
  onBack: () => void
  currentTheme: Theme
}

export function PersonalDataForm({
  bookingData,
  selectedService,
  selectedProfessional,
  isLoading,
  onInputChange,
  onSubmit,
  onBack,
  currentTheme
}: PersonalDataFormProps) {
  const formatDate = (date: Date) => {
    return format(date, "EEEE, d 'de' MMMM", { locale: es })
  }

  const getTimeFromDate = (date: Date) => {
    return format(date, 'HH:mm')
  }

  return (
    <div>
      <h2
        className="text-2xl font-bold mb-6 text-center"
        style={{ color: currentTheme.colors.text }}
      >
        Completa tus datos
      </h2>

      {/* Resumen de la reserva */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3
          className="font-semibold mb-4"
          style={{ color: currentTheme.colors.text }}
        >
          Resumen de tu reserva
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Briefcase
              className="h-5 w-5"
              style={{ color: currentTheme.colors.primary }}
            />
            <span style={{ color: currentTheme.colors.text }}>
              {selectedService?.name} ({selectedService?.duration} min) -
              {selectedService?.price}€
            </span>
          </div>
          <div className="flex items-center gap-3">
            <User
              className="h-5 w-5"
              style={{ color: currentTheme.colors.primary }}
            />
            <span style={{ color: currentTheme.colors.text }}>
              {selectedProfessional?.name || 'Cualquier profesional disponible'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar
              className="h-5 w-5"
              style={{ color: currentTheme.colors.primary }}
            />
            <span style={{ color: currentTheme.colors.text }}>
              {bookingData.date && formatDate(bookingData.date)}
              {bookingData.date &&
                ` a las ${getTimeFromDate(bookingData.date)}`}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium mb-2"
            style={{ color: currentTheme.colors.text }}
          >
            Nombre completo *
          </label>
          <ThemedInput
            id="name"
            type="text"
            value={bookingData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            required
            placeholder="Tu nombre completo"
            className="w-full"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium mb-2"
            style={{ color: currentTheme.colors.text }}
          >
            Correo electrónico *
          </label>
          <ThemedInput
            id="email"
            type="email"
            value={bookingData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            required
            placeholder="tu@email.com"
            className="w-full"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium mb-2"
            style={{ color: currentTheme.colors.text }}
          >
            Teléfono *
          </label>
          <ThemedInput
            id="phone"
            type="tel"
            value={bookingData.phone || ''}
            onChange={(e) => onInputChange('phone', e.target.value)}
            required
            placeholder="+34 600 123 456"
            className="w-full"
          />
        </div>

        <div className="flex justify-between pt-4">
          <ThemedButton type="button" variant="outline" onClick={onBack}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Atrás
          </ThemedButton>
          <ThemedButton
            type="submit"
            disabled={
              !bookingData.name ||
              !bookingData.email ||
              !bookingData.phone ||
              isLoading
            }
          >
            {isLoading ? 'Confirmando...' : 'Confirmar reserva'}
          </ThemedButton>
        </div>
      </form>
    </div>
  )
}
