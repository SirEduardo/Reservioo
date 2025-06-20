'use client'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ThemedButton } from '../themed/button'
import { Professional, Theme } from '@/types'

interface DateSelectionProps {
  availableDates: Date[]
  selectedDate: Date | null
  selectedProfessional: Professional | null | undefined
  onDateSelect: (date: Date) => void
  onBack: () => void
  onContinue: () => void
  currentTheme: Theme
}

export function DateSelection({
  availableDates,
  selectedDate,
  selectedProfessional,
  onDateSelect,
  onBack,
  onContinue,
  currentTheme
}: DateSelectionProps) {
  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }

  return (
    <div>
      <h2
        className="text-2xl font-bold mb-2 text-center"
        style={{ color: currentTheme.colors.text }}
      >
        ¿Qué día te viene mejor?
      </h2>
      {selectedProfessional ? (
        <p
          className="text-center mb-6"
          style={{ color: currentTheme.colors.textSecondary }}
        >
          Fechas disponibles para {selectedProfessional.name}
        </p>
      ) : (
        <p
          className="text-center mb-6"
          style={{ color: currentTheme.colors.textSecondary }}
        >
          Fechas disponibles con cualquier profesional
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
        {availableDates.map((date) => (
          <button
            key={date.toISOString()}
            onClick={() => onDateSelect(date)}
            className={`p-4 border-2 rounded-lg transition-all duration-300 text-center hover:shadow-lg hover:scale-105 ${
              selectedDate && isSameDay(selectedDate, date)
                ? 'ring-2 ring-blue-500'
                : ''
            }`}
            style={{
              borderColor:
                selectedDate && isSameDay(selectedDate, date)
                  ? currentTheme.colors.primary
                  : currentTheme.colors.border,
              backgroundColor:
                selectedDate && isSameDay(selectedDate, date)
                  ? currentTheme.colors.primaryLight
                  : currentTheme.colors.surface
            }}
            onMouseOver={(e) => {
              if (!selectedDate || !isSameDay(selectedDate, date)) {
                e.currentTarget.style.borderColor = currentTheme.colors.primary
                e.currentTarget.style.backgroundColor =
                  currentTheme.colors.primaryLight
              }
            }}
            onMouseOut={(e) => {
              if (!selectedDate || !isSameDay(selectedDate, date)) {
                e.currentTarget.style.borderColor = currentTheme.colors.border
                e.currentTarget.style.backgroundColor =
                  currentTheme.colors.surface
              }
            }}
          >
            <div
              className="text-xs font-medium mb-1"
              style={{ color: currentTheme.colors.textSecondary }}
            >
              {format(date, 'EEE', { locale: es })}
            </div>
            <div
              className="text-lg font-bold"
              style={{ color: currentTheme.colors.text }}
            >
              {date.getDate()}
            </div>
            <div
              className="text-xs"
              style={{ color: currentTheme.colors.textSecondary }}
            >
              {format(date, 'MMM', { locale: es })}
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-between">
        <ThemedButton variant="outline" onClick={onBack}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Atrás
        </ThemedButton>
        <ThemedButton onClick={onContinue} disabled={!selectedDate}>
          Continuar
          <ChevronRight className="h-4 w-4 ml-2" />
        </ThemedButton>
      </div>
    </div>
  )
}
