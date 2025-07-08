'use client'

import { useState } from 'react'
import { Plus, Trash2, AlarmClock, Calendar, Clock, Check } from 'lucide-react'

import { useTheme } from '@/context/theme-context'
import { useSchedule } from '@/context/schedules-context'
import { useProfessionals } from '@/context/professionals-context'
import { Schedule } from '@/types'
import { DAYS_OF_WEEK } from '@/app/mocks'
import { ThemedCard } from '../themed/card'
import { ThemedInput } from '../themed/input'
import { ThemedButton } from '../themed/button'

export default function SchedulesTab() {
  const { currentTheme } = useTheme()
  const { professionals } = useProfessionals()
  const {
    schedules,
    scheduleProfessionals,
    addSchedule,
    deleteSchedule,
    handleToggleProfessionalSchedule
  } = useSchedule()

  const [newSchedule, setNewSchedule] = useState({
    startTime: '09:00',
    endTime: '14:00'
  })

  const [selectedDays, setSelectedDays] = useState<number[]>([])

  const handleAdd = () => {
    if (selectedDays.length === 0) {
      alert('Selecciona al menos un día de la semana')
      return
    }
    selectedDays.forEach((dayOfWeek) => {
      addSchedule({
        ...newSchedule,
        dayOfWeek
      })
    })
    setNewSchedule({ startTime: '09:00', endTime: '14:00' })
    setSelectedDays([])
  }

  const toggleDaySelection = (dayOfWeek: number) => {
    setSelectedDays((prev) =>
      prev.includes(dayOfWeek)
        ? prev.filter((d) => d !== dayOfWeek)
        : [...prev, dayOfWeek]
    )
  }

  const getDayName = (dayOfWeek: number) => {
    return (
      DAYS_OF_WEEK.find((day) => day.value === dayOfWeek)?.label ||
      'Desconocido'
    )
  }

  const getSchedulesByDay = () => {
    const schedulesByDay: { [key: number]: Schedule[] } = {}
    schedules.forEach((schedule) => {
      if (!schedulesByDay[schedule.dayOfWeek]) {
        schedulesByDay[schedule.dayOfWeek] = []
      }
      schedulesByDay[schedule.dayOfWeek].push(schedule)
    })
    return schedulesByDay
  }

  const isProfessionalAssignedToSchedule = (
    scheduleId: string,
    professionalId: string
  ) => {
    return scheduleProfessionals.some(
      (sp) =>
        sp.scheduleId === scheduleId && sp.professionalId === professionalId
    )
  }

  const getAssignedProfessionals = (scheduleId: string) => {
    return professionals.filter((professional) =>
      scheduleProfessionals.some(
        (sp) =>
          sp.scheduleId === scheduleId && sp.professionalId === professional.id
      )
    )
  }

  return (
    <div className="space-y-6">
      {/* Formulario para crear nuevo horario */}
      <ThemedCard
        className="p-6"
        style={{ background: currentTheme.gradients.background }}
      >
        <h2
          className="text-lg sm:text-xl font-bold mb-6 flex items-center gap-2"
          style={{ color: currentTheme.colors.text }}
        >
          <AlarmClock
            className="h-6 w-6"
            style={{ color: currentTheme.colors.primary }}
          />
          Crear Nuevo Horario
        </h2>

        <div className="space-y-6">
          {/* Horario */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <ThemedInput
                label="Hora de Inicio"
                type="time"
                value={newSchedule.startTime}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, startTime: e.target.value })
                }
              />
            </div>
            <div>
              <ThemedInput
                label="Hora de Fin"
                type="time"
                value={newSchedule.endTime}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, endTime: e.target.value })
                }
              />
            </div>
          </div>

          {/* Selección de días */}
          <div>
            <label
              className="block text-sm font-medium mb-3"
              style={{ color: currentTheme.colors.text }}
            >
              Seleccionar Días de la Semana:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {DAYS_OF_WEEK.map((day) => (
                <ThemedButton
                  key={day.value}
                  variant={
                    selectedDays.includes(day.value) ? 'primary' : 'outline'
                  }
                  size="sm"
                  onClick={() => toggleDaySelection(day.value)}
                  className="justify-center"
                >
                  {selectedDays.includes(day.value) && (
                    <Check className="h-4 w-4 mr-1" />
                  )}
                  {day.label}
                </ThemedButton>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <ThemedButton onClick={handleAdd} className="flex-1">
              <Plus className="h-5 w-5 mr-2" />
              Crear Horario
            </ThemedButton>
          </div>
        </div>
      </ThemedCard>

      {/* Lista de horarios por día con asignación de profesionales */}
      <div className="space-y-6">
        {Object.entries(getSchedulesByDay())
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([dayOfWeek, daySchedules]) => (
            <ThemedCard key={dayOfWeek} className="p-6">
              <h3
                className="font-semibold text-lg mb-6 flex items-center gap-2"
                style={{ color: currentTheme.colors.text }}
              >
                <Calendar
                  className="h-5 w-5"
                  style={{ color: currentTheme.colors.primary }}
                />
                {getDayName(Number(dayOfWeek))}
              </h3>

              <div className="space-y-4">
                {daySchedules.map((schedule) => {
                  getAssignedProfessionals(schedule.id)

                  return (
                    <div
                      key={schedule.id}
                      className="border rounded-lg p-4 space-y-4"
                      style={{
                        borderColor: currentTheme.colors.border,
                        backgroundColor: currentTheme.colors.surface
                      }}
                    >
                      {/* Información del horario */}
                      <div className="flex flex-row items-center justify-between gap-3">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Clock
                              className="h-5 w-5"
                              style={{ color: currentTheme.colors.primary }}
                            />
                            <span
                              className="font-medium text-lg"
                              style={{ color: currentTheme.colors.text }}
                            >
                              {schedule.startTime} - {schedule.endTime}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteSchedule(schedule.id)}
                          className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300 cursor-pointer"
                          aria-label="Eliminar reserva"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                      {/* Asignación de profesionales */}
                      <div>
                        <h4
                          className="font-medium mb-3 text-sm"
                          style={{ color: currentTheme.colors.text }}
                        >
                          Asignar/Desasignar Profesionales:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {professionals.map((professional) => (
                            <ThemedButton
                              key={professional.id}
                              variant={
                                isProfessionalAssignedToSchedule(
                                  schedule.id,
                                  professional.id
                                )
                                  ? 'primary'
                                  : 'outline'
                              }
                              size="sm"
                              onClick={() =>
                                handleToggleProfessionalSchedule(
                                  schedule.id,
                                  professional.id
                                )
                              }
                            >
                              {professional.name}
                            </ThemedButton>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ThemedCard>
          ))}
      </div>

      {/* Mensaje por si no hay horarios */}
      {schedules.length === 0 && (
        <ThemedCard className="p-8 text-center">
          <AlarmClock
            className="h-12 w-12 mx-auto mb-4"
            style={{ color: currentTheme.colors.primary }}
          />
          <h3
            className="text-lg font-medium mb-2"
            style={{ color: currentTheme.colors.text }}
          >
            No hay horarios configurados
          </h3>
          <p style={{ color: currentTheme.colors.textSecondary }}>
            Crea tu primer horario usando el formulario de arriba
          </p>
        </ThemedCard>
      )}
    </div>
  )
}
