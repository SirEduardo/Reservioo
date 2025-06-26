'use client'

import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { ThemedButton } from '../themed/button'
import type { Theme, TimeSlot } from '@/types'

interface TimeSelectionProps {
  availableSlots: TimeSlot[]
  selectedTime: string | null
  selectedProfessionalId: string | null
  isLoadingSlots: boolean
  onTimeSelect: (time: string) => void
  onBack: () => void
  onContinue: () => void
  onBackToDate: () => void
  onBackToProfessional: () => void
  currentTheme: Theme
}

export function TimeSelection({
  availableSlots,
  selectedTime,
  selectedProfessionalId,
  isLoadingSlots,
  onTimeSelect,
  onBack,
  onContinue,
  onBackToDate,
  onBackToProfessional,
  currentTheme
}: TimeSelectionProps) {
  const hasSelectedTime = () => {
    return !!selectedTime
  }

  return (
    <div className="max-w-4xl mx-auto px-3">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center mb-2">
          <Clock
            className="h-5 w-5 mr-2"
            style={{ color: currentTheme.colors.primary }}
          />
          <h2
            className="text-lg sm:text-xl font-bold"
            style={{ color: currentTheme.colors.text }}
          >
            ¿A qué hora prefieres?
          </h2>
        </div>

        <p
          className="text-xs sm:text-sm"
          style={{ color: currentTheme.colors.textSecondary }}
        >
          Horarios disponibles
          {hasSelectedTime() && (
            <span
              className="block sm:inline mt-1 sm:mt-0"
              style={{ color: currentTheme.colors.primary }}
            ></span>
          )}
        </p>
      </div>

      {/* Contenido principal */}
      <div className="mb-4">
        {isLoadingSlots ? (
          <div className="text-center py-6">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ backgroundColor: currentTheme.colors.primaryLight }}
            >
              <div
                className="animate-spin rounded-full h-6 w-6 border-b-2"
                style={{ borderColor: currentTheme.colors.primary }}
              />
            </div>
            <p
              className="text-sm"
              style={{ color: currentTheme.colors.textSecondary }}
            >
              Cargando horarios...
            </p>
          </div>
        ) : availableSlots.length > 0 ? (
          <>
            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-6">
              {availableSlots.map((slot) => (
                <button
                  key={slot.time}
                  type="button"
                  onClick={() => onTimeSelect(slot.time)}
                  className={`p-3 border-2 rounded-lg transition-all duration-300 text-center hover:shadow-lg hover:scale-105 ${
                    selectedTime === slot.time ? 'ring-2 ring-blue-500' : ''
                  }`}
                  style={{
                    borderColor:
                      selectedTime === slot.time
                        ? currentTheme.colors.primary
                        : currentTheme.colors.border,
                    backgroundColor:
                      selectedTime === slot.time
                        ? currentTheme.colors.primaryLight
                        : currentTheme.colors.surface
                  }}
                  onMouseOver={(e) => {
                    if (selectedTime !== slot.time) {
                      e.currentTarget.style.borderColor =
                        currentTheme.colors.primary
                      e.currentTarget.style.backgroundColor =
                        currentTheme.colors.primaryLight
                    }
                  }}
                  onMouseOut={(e) => {
                    if (selectedTime !== slot.time) {
                      e.currentTarget.style.borderColor =
                        currentTheme.colors.border
                      e.currentTarget.style.backgroundColor =
                        currentTheme.colors.surface
                    }
                  }}
                >
                  <div
                    className="font-medium"
                    style={{ color: currentTheme.colors.text }}
                  >
                    {slot.time}
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div
            className="text-center py-6 px-4 rounded-lg"
            style={{
              backgroundColor: currentTheme.colors.surface,
              border: `1px solid ${currentTheme.colors.border}`
            }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ backgroundColor: currentTheme.colors.primaryLight }}
            >
              <Clock
                className="h-6 w-6"
                style={{ color: currentTheme.colors.primary }}
              />
            </div>
            <h3
              className="text-base font-semibold mb-2"
              style={{ color: currentTheme.colors.text }}
            >
              No hay horarios disponibles
            </h3>
            <p
              className="text-xs sm:text-sm mb-4"
              style={{ color: currentTheme.colors.textSecondary }}
            >
              {selectedProfessionalId
                ? "Intenta con otra fecha o selecciona 'Cualquier profesional'"
                : 'Intenta con otra fecha o selecciona un profesional específico'}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <ThemedButton
                variant="outline"
                onClick={onBackToDate}
                className="text-xs sm:text-sm py-1.5"
              >
                Elegir otra fecha
              </ThemedButton>
              <ThemedButton
                variant="outline"
                onClick={onBackToProfessional}
                className="text-xs sm:text-sm py-1.5"
              >
                Cambiar profesional
              </ThemedButton>
            </div>
          </div>
        )}
      </div>

      {/* Hora seleccionada */}
      {selectedTime && (
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
            Hora seleccionada:
          </p>
          <p
            className="text-sm sm:text-base font-bold mt-0.5"
            style={{ color: currentTheme.colors.primary }}
          >
            {selectedTime}
          </p>
        </div>
      )}

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
          disabled={!hasSelectedTime()}
          className="order-2 w-full sm:w-auto py-2 text-sm"
        >
          Continuar
          <ChevronRight className="h-4 w-4 ml-1" />
        </ThemedButton>
      </div>
    </div>
  )
}
