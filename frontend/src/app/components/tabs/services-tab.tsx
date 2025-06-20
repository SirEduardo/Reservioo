'use client'

import { useState } from 'react'
import { Plus, Trash2, Briefcase, Clock } from 'lucide-react'

import { useTheme } from '@/context/theme-context'
import { useProfessionals } from '@/context/professionals-context'
import { useService } from '@/context/services-context'
import { ThemedCard } from '../themed/card'
import { ThemedInput } from '../themed/input'
import { ThemedButton } from '../themed/button'
import { ThemedBadge } from '../themed/badge'

export default function ServicesTab() {
  const { currentTheme } = useTheme()
  const { professionals } = useProfessionals()
  const {
    handleAddService,
    handleDeleteService,
    handleToggleProfessionalService,
    professionalServices,
    services,
    loading,
    error
  } = useService()
  const [newService, setNewService] = useState({
    name: '',
    duration: 30,
    price: 0
  })

  const handleAdd = () => {
    if (newService.name) {
      handleAddService(newService)
      setNewService({ name: '', duration: 30, price: 0 })
    }
  }

  const isProfessionalAssignedToService = (
    serviceId: string,
    professionalId: string
  ) => {
    return professionalServices.some(
      (ps) => ps.serviceId === serviceId && ps.professionalId === professionalId
    )
  }

  if (loading) return <p>Cargando profesionales...</p>
  if (error) return <p>{error}</p>

  return (
    <div className="space-y-6">
      <ThemedCard
        className="p-6"
        style={{ background: currentTheme.gradients.background }}
      >
        <h2
          className="text-xl font-bold mb-6 flex items-center gap-2"
          style={{ color: currentTheme.colors.text }}
        >
          <Briefcase
            className="h-6 w-6"
            style={{ color: currentTheme.colors.primary }}
          />
          🎨 Crear Nuevo Servicio
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <ThemedInput
              label="Nombre del Servicio"
              value={newService.name}
              onChange={(e) =>
                setNewService({ ...newService, name: e.target.value })
              }
              placeholder="Ej: Corte de Cabello"
            />
          </div>
          <div>
            <ThemedInput
              label="Duración (min)"
              type="number"
              value={newService.duration}
              onChange={(e) =>
                setNewService({
                  ...newService,
                  duration: Number(e.target.value)
                })
              }
              min="15"
              step="15"
            />
          </div>
          <div>
            <ThemedInput
              label="Precio (€)"
              type="number"
              value={newService.price}
              onChange={(e) =>
                setNewService({ ...newService, price: Number(e.target.value) })
              }
              min="0"
              step="0.01"
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-1 flex items-end">
            <ThemedButton
              onClick={handleAdd}
              className="w-full  cursor-pointer"
            >
              <Plus className="h-5 w-5" />
              Crear
            </ThemedButton>
          </div>
        </div>
      </ThemedCard>

      <div className="grid gap-4">
        {services.map((service) => (
          <ThemedCard key={service.id} hover className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-4">
              <div className="min-w-0 flex-1">
                <h3
                  className="font-semibold text-lg"
                  style={{ color: currentTheme.colors.text }}
                >
                  {service.name}
                </h3>
                <div className="flex items-center gap-4 mt-2">
                  <ThemedBadge variant="neutral">
                    <Clock className="h-3 w-3 mr-1" />
                    {service.duration} min
                  </ThemedBadge>
                  <span
                    className="text-lg font-semibold"
                    style={{ color: currentTheme.colors.success }}
                  >
                    {service.price}€
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDeleteService(service.id)}
                  className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300 cursor-pointer"
                  aria-label="Eliminar reserva"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div>
              <h4
                className="font-medium mb-3"
                style={{ color: currentTheme.colors.text }}
              >
                Asignar/Desasignar Profesionales:
              </h4>
              <div className="flex flex-wrap gap-2">
                {professionals.map((professional) => (
                  <ThemedButton
                    className="cursor-pointer"
                    key={professional.id}
                    variant={
                      isProfessionalAssignedToService(
                        service.id,
                        professional.id
                      )
                        ? 'primary'
                        : 'outline'
                    }
                    size="sm"
                    onClick={() =>
                      handleToggleProfessionalService(
                        service.id,
                        professional.id
                      )
                    }
                  >
                    {professional.name}
                  </ThemedButton>
                ))}
              </div>
            </div>
          </ThemedCard>
        ))}
      </div>
    </div>
  )
}
