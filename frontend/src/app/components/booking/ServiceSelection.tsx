'use client'

import { Clock, ChevronRight } from 'lucide-react'
import { ThemedButton } from '../themed/button'
import { Service } from '@/types'

interface ServiceSelectionProps {
  services: Service[]
  selectedServiceId: string
  onServiceSelect: (serviceId: string) => void
  onContinue: () => void
  currentTheme: any
}

export function ServiceSelection({
  services,
  selectedServiceId,
  onServiceSelect,
  onContinue,
  currentTheme
}: ServiceSelectionProps) {
  return (
    <div>
      <h2
        className="text-2xl font-bold mb-6 text-center"
        style={{ color: currentTheme.colors.text }}
      >
        ¿Qué servicio necesitas?
      </h2>

      <div
        className={
          services.length === 1
            ? 'flex justify-center mb-6'
            : 'grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'
        }
      >
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => onServiceSelect(service.id)}
            className={`p-6 border-2 rounded-lg transition-all duration-300 text-left group hover:shadow-lg hover:scale-105 ${
              selectedServiceId === service.id ? 'ring-2 ring-blue-500' : ''
            }`}
            style={{
              borderColor:
                selectedServiceId === service.id
                  ? currentTheme.colors.primary
                  : currentTheme.colors.border,
              backgroundColor:
                selectedServiceId === service.id
                  ? currentTheme.colors.primaryLight
                  : currentTheme.colors.surface
            }}
            onMouseOver={(e) => {
              if (selectedServiceId !== service.id) {
                e.currentTarget.style.borderColor = currentTheme.colors.primary
                e.currentTarget.style.backgroundColor =
                  currentTheme.colors.primaryLight
              }
            }}
            onMouseOut={(e) => {
              if (selectedServiceId !== service.id) {
                e.currentTarget.style.borderColor = currentTheme.colors.border
                e.currentTarget.style.backgroundColor =
                  currentTheme.colors.surface
              }
            }}
          >
            <div className="flex justify-between items-start mb-3">
              <h3
                className="font-semibold text-lg"
                style={{ color: currentTheme.colors.text }}
              >
                {service.name}
              </h3>
              <span
                className="text-2xl font-bold"
                style={{ color: currentTheme.colors.primary }}
              >
                €{service.price}
              </span>
            </div>
            <div
              className="flex items-center text-sm"
              style={{ color: currentTheme.colors.textSecondary }}
            >
              <Clock className="h-4 w-4 mr-1" />
              {service.duration} minutos
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-center">
        <ThemedButton onClick={onContinue} disabled={!selectedServiceId}>
          Continuar
          <ChevronRight className="h-4 w-4 ml-2" />
        </ThemedButton>
      </div>
    </div>
  )
}
