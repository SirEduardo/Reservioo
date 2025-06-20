'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Users, User } from 'lucide-react'
import { Booking } from '@/types'

import { useTheme } from '@/context/theme-context'

import { useProfessionals } from '@/context/professionals-context'
import { ThemedCard } from '../themed/card'
import { ThemedInput } from '../themed/input'
import { ThemedButton } from '../themed/button'
import { ThemedBadge } from '../themed/badge'

interface ProfessionalsTabProps {
  bookings: Booking[]
}

export default function ProfessionalsTab({ bookings }: ProfessionalsTabProps) {
  const { currentTheme } = useTheme()
  const {
    loading,
    error,
    professionals,
    handleAddProfessional,
    handleDeleteProfessional
  } = useProfessionals()
  const [newProfessional, setNewProfessional] = useState({ name: '' })

  const handleAddInput = () => {
    handleAddProfessional(newProfessional.name)
    setNewProfessional({ name: '' })
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
          <Users
            className="h-6 w-6"
            style={{ color: currentTheme.colors.primary }}
          />
          ✨ Agregar Nuevo Profesional
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <ThemedInput
              label="Nombre del Profesional"
              value={newProfessional.name}
              onChange={(e: any) =>
                setNewProfessional({ name: e.target.value })
              }
              placeholder="Ej: María García"
            />
          </div>
          <ThemedButton onClick={handleAddInput} size="lg">
            <Plus className="h-5 w-5" />
            Agregar
          </ThemedButton>
        </div>
      </ThemedCard>

      <div className="grid gap-4">
        {professionals.map((professional) => (
          <ThemedCard key={professional.id} hover className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ background: currentTheme.gradients.primary }}
                >
                  <User className="h-7 w-7 text-white" />
                </div>
                <div className="min-w-0 flex-1 cursor-pointer">
                  <h3
                    className="font-semibold text-base truncate"
                    style={{ color: currentTheme.colors.text }}
                  >
                    {professional.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <ThemedBadge variant="primary">
                      {
                        bookings.filter(
                          (b) =>
                            b.professionalId === professional.id &&
                            b.date &&
                            b.date > new Date()
                        ).length
                      }{' '}
                      citas próximas
                    </ThemedBadge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <ThemedButton variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </ThemedButton>
                <button
                  onClick={() => handleDeleteProfessional(professional.id)}
                  className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300 cursor-pointer"
                  aria-label="Eliminar reserva"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </ThemedCard>
        ))}
      </div>
    </div>
  )
}
