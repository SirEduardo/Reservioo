'use client'

import { User, ChevronLeft, ChevronRight } from 'lucide-react'
import { ThemedButton } from '../themed/button'
import { Professional, Theme } from '@/types'

interface ProfessionalSelectionProps {
  professionals: Professional[]
  selectedProfessionalId: string | null
  onProfessionalSelect: (professionalId: string | null) => void
  onBack: () => void
  onContinue: () => void
  currentTheme: Theme
}

export function ProfessionalSelection({
  professionals,
  selectedProfessionalId,
  onProfessionalSelect,
  onBack,
  onContinue,
  currentTheme
}: ProfessionalSelectionProps) {
  return (
    <div>
      <h2
        className="text-2xl font-bold mb-2 text-center"
        style={{ color: currentTheme.colors.text }}
      >
        ¿Tienes preferencia de profesional?
      </h2>
      <p
        className="text-center mb-6"
        style={{ color: currentTheme.colors.textSecondary }}
      >
        Puedes elegir un profesional específico o dejar que asignemos el primero
        disponible
      </p>

      <div
        className={
          professionals.length === 1
            ? 'flex justify-center mb-6 flex-wrap gap-4'
            : 'grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6'
        }
      >
        {/* Opción: Cualquier profesional */}
        <button
          onClick={() => onProfessionalSelect(null)}
          className={`p-6 border-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 ${
            selectedProfessionalId === null ? 'ring-2 ring-blue-500' : ''
          }`}
          style={{
            borderColor:
              selectedProfessionalId === null
                ? currentTheme.colors.primary
                : currentTheme.colors.border,
            backgroundColor:
              selectedProfessionalId === null
                ? currentTheme.colors.primaryLight
                : currentTheme.colors.surface
          }}
          onMouseOver={(e) => {
            if (selectedProfessionalId !== null) {
              e.currentTarget.style.borderColor = currentTheme.colors.primary
              e.currentTarget.style.backgroundColor =
                currentTheme.colors.primaryLight
            }
          }}
          onMouseOut={(e) => {
            if (selectedProfessionalId !== null) {
              e.currentTarget.style.borderColor = currentTheme.colors.border
              e.currentTarget.style.backgroundColor =
                currentTheme.colors.surface
            }
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: currentTheme.colors.primary }}
            >
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <h3
                className="font-semibold"
                style={{ color: currentTheme.colors.text }}
              >
                Cualquier profesional
              </h3>
              <p
                className="text-sm"
                style={{ color: currentTheme.colors.textSecondary }}
              >
                Te asignaremos el primero disponible
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: currentTheme.colors.primary }}
              >
                ✓ Más fechas y horarios disponibles
              </p>
            </div>
          </div>
        </button>
        {/* Profesionales específicos */}
        {professionals.map((professional) => (
          <button
            key={professional.id}
            onClick={() => onProfessionalSelect(professional.id)}
            className={`p-6 border-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 ${
              selectedProfessionalId === professional.id
                ? 'ring-2 ring-blue-500'
                : ''
            }`}
            style={{
              borderColor:
                selectedProfessionalId === professional.id
                  ? currentTheme.colors.primary
                  : currentTheme.colors.border,
              backgroundColor:
                selectedProfessionalId === professional.id
                  ? currentTheme.colors.primaryLight
                  : currentTheme.colors.surface
            }}
            onMouseOver={(e) => {
              if (selectedProfessionalId !== professional.id) {
                e.currentTarget.style.borderColor = currentTheme.colors.primary
                e.currentTarget.style.backgroundColor =
                  currentTheme.colors.primaryLight
              }
            }}
            onMouseOut={(e) => {
              if (selectedProfessionalId !== professional.id) {
                e.currentTarget.style.borderColor = currentTheme.colors.border
                e.currentTarget.style.backgroundColor =
                  currentTheme.colors.surface
              }
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: currentTheme.colors.primary }}
              >
                <span className="text-white font-semibold">
                  {professional.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </span>
              </div>
              <div className="text-left">
                <h3
                  className="font-semibold"
                  style={{ color: currentTheme.colors.text }}
                >
                  {professional.name}
                </h3>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-between">
        <ThemedButton variant="outline" onClick={onBack}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Atrás
        </ThemedButton>
        <ThemedButton onClick={onContinue}>
          Continuar
          <ChevronRight className="h-4 w-4 ml-2" />
        </ThemedButton>
      </div>
    </div>
  )
}
