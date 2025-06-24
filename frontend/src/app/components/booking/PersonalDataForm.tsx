'use client'

import type React from 'react'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  ChevronLeft,
  Briefcase,
  User,
  Calendar,
  CheckCircle
} from 'lucide-react'
import { ThemedButton } from '../themed/button'
import { ThemedInput } from '../themed/input'
import type { Service, Professional, Theme } from '@/types'

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

  const isFormValid = bookingData.name && bookingData.email && bookingData.phone

  return (
    <div className="max-w-3xl mx-auto px-4">
      {/* Header elegante */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-3">
          <CheckCircle
            className="h-6 w-6 mr-2"
            style={{ color: currentTheme.colors.primary }}
          />
          <h2
            className="text-xl sm:text-2xl font-bold"
            style={{ color: currentTheme.colors.text }}
          >
            Completa tus datos
          </h2>
        </div>
        <p
          className="text-sm sm:text-base"
          style={{ color: currentTheme.colors.textSecondary }}
        >
          Solo necesitamos algunos datos para confirmar tu cita
        </p>
      </div>

      {/* Resumen elegante y legible */}
      <div
        className="rounded-xl p-5 mb-6 shadow-sm"
        style={{
          backgroundColor: currentTheme.colors.surface,
          border: `2px solid ${currentTheme.colors.border}`
        }}
      >
        <h3
          className="font-semibold mb-4 text-base"
          style={{ color: currentTheme.colors.text }}
        >
          Resumen de tu reserva
        </h3>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div
              className="p-2 rounded-lg flex-shrink-0"
              style={{ backgroundColor: currentTheme.colors.primaryLight }}
            >
              <Briefcase
                className="h-5 w-5"
                style={{ color: currentTheme.colors.primary }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div
                className="font-medium text-base"
                style={{ color: currentTheme.colors.text }}
              >
                {selectedService?.name}
              </div>
              <div
                className="text-sm mt-1"
                style={{ color: currentTheme.colors.textSecondary }}
              >
                Duración: {selectedService?.duration} minutos • Precio:{' '}
                {selectedService?.price}€
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div
              className="p-2 rounded-lg flex-shrink-0"
              style={{ backgroundColor: currentTheme.colors.primaryLight }}
            >
              <User
                className="h-5 w-5"
                style={{ color: currentTheme.colors.primary }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div
                className="font-medium text-base"
                style={{ color: currentTheme.colors.text }}
              >
                {selectedProfessional?.name ||
                  'Cualquier profesional disponible'}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div
              className="p-2 rounded-lg flex-shrink-0"
              style={{ backgroundColor: currentTheme.colors.primaryLight }}
            >
              <Calendar
                className="h-5 w-5"
                style={{ color: currentTheme.colors.primary }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div
                className="font-medium text-base"
                style={{ color: currentTheme.colors.text }}
              >
                {bookingData.date && formatDate(bookingData.date)}
              </div>
              <div
                className="text-sm mt-1"
                style={{ color: currentTheme.colors.textSecondary }}
              >
                Hora: {bookingData.date && getTimeFromDate(bookingData.date)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario con buen UX */}
      <form onSubmit={onSubmit} className="space-y-5">
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
            placeholder="Escribe tu nombre completo"
            className="w-full text-base py-3"
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
            className="w-full text-base py-3"
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
            className="w-full text-base py-3"
          />
        </div>
        {/* Botones con buen spacing */}
        <div className="flex sm:flex-row justify-between gap-4 pt-4">
          <ThemedButton
            type="button"
            variant="outline"
            onClick={onBack}
            className="order-1 w-full sm:w-auto py-3 text-base"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Atrás
          </ThemedButton>

          <ThemedButton
            type="submit"
            disabled={!isFormValid || isLoading}
            className="order-2 w-full sm:w-auto py-3 text-base font-medium"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div
                  className="animate-spin rounded-full h-4 w-4 border-b-2"
                  style={{ borderColor: 'white' }}
                />
                Confirmando reserva...
              </div>
            ) : (
              'Confirmar reserva'
            )}
          </ThemedButton>
        </div>
      </form>

      {/* Nota de confianza */}
      <div className="text-center mt-6 pb-4">
        <p
          className="text-sm"
          style={{ color: currentTheme.colors.textSecondary }}
        >
          🔒 Tus datos están protegidos y solo se usarán para gestionar tu cita
        </p>
      </div>
    </div>
  )
}
