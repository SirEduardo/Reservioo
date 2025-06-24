'use client'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import type { Professional, Theme } from '@/types'
import { ThemedButton } from '../themed/button'

interface DateSelectionProps {
  availableDates: Date[]
  selectedDate: Date | null
  selectedProfessional: Professional | null | undefined
  onDateSelect: (date: Date) => void
  onBack: () => void
  onContinue: () => void
  currentTheme: Theme
  currentMonth: number
  currentYear: number
  onMonthChange: (direction: 'prev' | 'next') => void
}

export function DateSelection({
  availableDates,
  selectedDate,
  selectedProfessional,
  onDateSelect,
  onBack,
  onContinue,
  currentTheme,
  currentMonth,
  currentYear,
  onMonthChange
}: DateSelectionProps) {
  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return isSameDay(date, today)
  }

  const monthName = format(new Date(currentYear, currentMonth - 1), 'MMMM', {
    locale: es
  })

  // Filtrar días disponibles: sólo hoy o futuros
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const filteredAvailableDates = availableDates.filter((date) => {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d >= today
  })

  // Verificar si hay fechas disponibles en el mes actual
  const hasAvailableDatesInCurrentMonth = filteredAvailableDates.some(
    (date) =>
      date.getMonth() === currentMonth - 1 && date.getFullYear() === currentYear
  )

  return (
    <div className="max-w-4xl mx-auto px-3">
      {/* Selector de mes mejorado */}
      <div className="flex items-center justify-center mb-4 gap-3">
        <button
          aria-label="Mes anterior"
          onClick={() => onMonthChange('prev')}
          className="p-2 rounded-lg transition-colors duration-200 hover:shadow-sm"
          style={{
            backgroundColor: currentTheme.colors.surface,
            border: `1px solid ${currentTheme.colors.border}`,
            color: currentTheme.colors.text
          }}
          type="button"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="text-center min-w-[140px]">
          <span
            className="font-bold text-lg block"
            style={{ color: currentTheme.colors.text }}
          >
            {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
          </span>
          <span
            className="text-sm font-medium"
            style={{ color: currentTheme.colors.textSecondary }}
          >
            {currentYear}
          </span>
        </div>

        <button
          aria-label="Mes siguiente"
          onClick={() => onMonthChange('next')}
          className="p-2 rounded-lg transition-colors duration-200 hover:shadow-sm"
          style={{
            backgroundColor: currentTheme.colors.surface,
            border: `1px solid ${currentTheme.colors.border}`,
            color: currentTheme.colors.text
          }}
          type="button"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Header compacto */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center mb-2">
          <Calendar
            className="h-5 w-5 mr-2"
            style={{ color: currentTheme.colors.primary }}
          />
          <h2
            className="text-lg sm:text-xl font-bold"
            style={{ color: currentTheme.colors.text }}
          >
            ¿Qué día te viene mejor?
          </h2>
        </div>

        <p
          className="text-xs sm:text-sm"
          style={{ color: currentTheme.colors.textSecondary }}
        >
          {selectedProfessional
            ? `Disponible para ${selectedProfessional.name}`
            : 'Disponible con cualquier profesional'}
        </p>
      </div>

      {/* Grid del calendario */}
      <div className="mb-4">
        {!hasAvailableDatesInCurrentMonth ? (
          <div
            className="text-center py-8 px-4 rounded-lg"
            style={{
              backgroundColor: currentTheme.colors.surface,
              border: `1px solid ${currentTheme.colors.border}`
            }}
          >
            <Calendar
              className="h-8 w-8 mx-auto mb-2 opacity-50"
              style={{ color: currentTheme.colors.textSecondary }}
            />
            <p
              className="text-sm font-medium mb-1"
              style={{ color: currentTheme.colors.text }}
            >
              No hay fechas disponibles
            </p>
            <p
              className="text-xs"
              style={{ color: currentTheme.colors.textSecondary }}
            >
              Prueba navegando a otro mes
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-1.5 sm:gap-2">
            {filteredAvailableDates
              .filter(
                (date) =>
                  date.getMonth() === currentMonth - 1 &&
                  date.getFullYear() === currentYear
              )
              .map((date) => {
                const isSelected = selectedDate && isSameDay(selectedDate, date)
                const todayDate = isToday(date)

                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => onDateSelect(date)}
                    className={`
                      relative p-2 sm:p-2.5 rounded-lg transition-all duration-150 
                      text-center min-h-[56px] sm:min-h-[60px] 
                      active:scale-95 hover:scale-102
                      ${isSelected ? 'shadow-md' : 'hover:shadow-sm'}
                      ${todayDate ? 'ring-1 ring-opacity-40' : ''}
                    `}
                    style={{
                      borderWidth: '1.5px',
                      borderStyle: 'solid',
                      borderColor: isSelected
                        ? currentTheme.colors.primary
                        : currentTheme.colors.border,
                      backgroundColor: isSelected
                        ? currentTheme.colors.primary
                        : currentTheme.colors.surface
                    }}
                  >
                    {/* Indicador de hoy */}
                    {todayDate && (
                      <div
                        className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                        style={{ backgroundColor: currentTheme.colors.primary }}
                      />
                    )}

                    {/* Día de la semana */}
                    <div
                      className="text-[10px] sm:text-xs font-medium mb-0.5 uppercase tracking-wide"
                      style={{
                        color: isSelected
                          ? 'white'
                          : currentTheme.colors.textSecondary
                      }}
                    >
                      {format(date, 'EEE', { locale: es }).slice(0, 2)}
                    </div>

                    {/* Número del día */}
                    <div
                      className="text-sm sm:text-base font-bold mb-0.5"
                      style={{
                        color: isSelected ? 'white' : currentTheme.colors.text
                      }}
                    >
                      {date.getDate()}
                    </div>

                    {/* Mes */}
                    <div
                      className="text-[9px] sm:text-[10px] capitalize leading-tight"
                      style={{
                        color: isSelected
                          ? 'rgba(255, 255, 255, 0.8)'
                          : currentTheme.colors.textSecondary
                      }}
                    >
                      {format(date, 'MMM', { locale: es }).slice(0, 3)}
                    </div>
                  </button>
                )
              })}
          </div>
        )}
      </div>

      {/* Fecha seleccionada */}
      {selectedDate && (
        <div
          className="text-center mb-4 p-3 rounded-lg"
          style={{
            backgroundColor: currentTheme.colors.primaryLight,
            border: `1px solid ${currentTheme.colors.primary}20`
          }}
        >
          <p
            className="text-xs font-medium"
            style={{ color: currentTheme.colors.textSecondary }}
          >
            Fecha seleccionada:
          </p>
          <p
            className="text-sm sm:text-base font-bold mt-0.5"
            style={{ color: currentTheme.colors.primary }}
          >
            {format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", {
              locale: es
            })}
          </p>
        </div>
      )}

      {/* Botones de navegación */}
      <div className="flex justify-between gap-2 sm:gap-0">
        <ThemedButton
          variant="outline"
          onClick={onBack}
          className="order-1 w-full sm:w-auto py-2 text-sm"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Atrás
        </ThemedButton>

        <ThemedButton
          onClick={onContinue}
          disabled={!selectedDate}
          className="order-2 w-full sm:w-auto py-2 text-sm"
        >
          Continuar
          <ChevronRight className="h-4 w-4 ml-1" />
        </ThemedButton>
      </div>
    </div>
  )
}
