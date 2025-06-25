'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Users, User } from 'lucide-react'
import { useTheme } from '@/context/theme-context'
import { useProfessionals } from '@/context/professionals-context'
import { ThemedCard } from '../themed/card'
import { ThemedInput } from '../themed/input'
import { ThemedButton } from '../themed/button'
import { ThemedBadge } from '../themed/badge'
import { useBookings } from '@/context/bookings-context'

export default function ProfessionalsTab() {
  const { currentTheme } = useTheme()
  const {
    loading,
    professionals,
    handleAddProfessional,
    handleDeleteProfessional
  } = useProfessionals()
  const { bookings } = useBookings()
  const [newProfessional, setNewProfessional] = useState({ name: '' })

  const handleAddInput = () => {
    handleAddProfessional(newProfessional.name)
    setNewProfessional({ name: '' })
  }
  if (loading) return <p>Cargando profesionales...</p>

  return (
    <div className="space-y-6">
      <ThemedCard
        className="p-4 sm:p-6"
        style={{ background: currentTheme.gradients.background }}
      >
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <Users
            className="hidden sm:block h-6 w-6"
            style={{ color: currentTheme.colors.primary }}
          />
          <h2
            className="text-lg font-bold sm:text-xl"
            style={{ color: currentTheme.colors.text }}
          >
            ✨ Agregar Nuevo Profesional
          </h2>
        </div>
        <div className="flex gap-2 items-end">
          <ThemedInput
            label="Nombre del Profesional"
            value={newProfessional.name}
            onChange={(e) => setNewProfessional({ name: e.target.value })}
            placeholder="Ej: María García"
            className="flex-1"
          />
          <ThemedButton
            onClick={handleAddInput}
            size="lg"
            className="w-auto h-[42px]"
          >
            <Plus className="h-5 w-5" />
            Agregar
          </ThemedButton>
        </div>
      </ThemedCard>

      <div className="grid gap-4">
        {professionals.map((professional) => (
          <ThemedCard key={professional.id} hover className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: currentTheme.gradients.primary }}
              >
                <User className="h-7 w-7 text-white" />
              </div>
              <div className="min-w-0 flex-1 cursor-pointer">
                <h3
                  className="font-semibold truncate text-base sm:text-lg"
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
              <button
                onClick={() => handleDeleteProfessional(professional.id)}
                className="p-2 sm:p-3 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300 cursor-pointer ml-2"
                aria-label="Eliminar reserva"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </ThemedCard>
        ))}
      </div>
    </div>
  )
}
