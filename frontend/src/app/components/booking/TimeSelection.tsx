'use client'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { ThemedButton } from '../themed/button'
import { Theme, TimeSlot } from '@/types'

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
    <div>
      <h2
        className="text-2xl font-bold mb-2 text-center"
        style={{ color: currentTheme.colors.text }}
      >
        ¿A qué hora prefieres?
      </h2>
      <p
        className="text-center mb-6"
        style={{ color: currentTheme.colors.textSecondary }}
      >
        Horarios disponibles
        {hasSelectedTime() && (
          <span style={{ color: currentTheme.colors.primary }}>
            {' '}
            • Hora seleccionada: {selectedTime}
          </span>
        )}
      </p>

      {isLoadingSlots ? (
        <div className="text-center py-8">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: currentTheme.colors.primaryLight }}
          >
            <div
              className="animate-spin rounded-full h-8 w-8 border-b-2"
              style={{ borderColor: currentTheme.colors.primary }}
            ></div>
          </div>
          <p style={{ color: currentTheme.colors.textSecondary }}>
            Cargando horarios disponibles...
          </p>
        </div>
      ) : availableSlots.length > 0 ? (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-6">
            {availableSlots.map((slot) => (
              <button
                key={slot.time}
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
        <div className="text-center py-8">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: currentTheme.colors.primaryLight }}
          >
            <Clock
              className="h-8 w-8"
              style={{ color: currentTheme.colors.primary }}
            />
          </div>
          <h3
            className="text-lg font-semibold mb-2"
            style={{ color: currentTheme.colors.text }}
          >
            No hay horarios disponibles
          </h3>
          <p style={{ color: currentTheme.colors.textSecondary }}>
            No hay horarios disponibles para la fecha seleccionada.
            {selectedProfessionalId
              ? ` Intenta con otra fecha o selecciona "Cualquier profesional" para más opciones.`
              : ' Intenta con otra fecha o selecciona un profesional específico.'}
          </p>
          <div className="flex gap-3 justify-center mt-6">
            <ThemedButton variant="outline" onClick={onBackToDate}>
              Elegir otra fecha
            </ThemedButton>
            <ThemedButton variant="outline" onClick={onBackToProfessional}>
              Cambiar profesional
            </ThemedButton>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <ThemedButton variant="outline" onClick={onBack}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Atrás
        </ThemedButton>
        <ThemedButton onClick={onContinue} disabled={!hasSelectedTime()}>
          Continuar
          <ChevronRight className="h-4 w-4 ml-2" />
        </ThemedButton>
      </div>
    </div>
  )
}
