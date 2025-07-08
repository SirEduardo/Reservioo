'use client'

import { useState } from 'react'
import {
  Settings,
  Copy,
  Check,
  Plus,
  Calendar,
  AlertCircle,
  Trash2,
  Users,
  Briefcase,
  TrendingUp,
  DollarSign
} from 'lucide-react'
import type { CompanySettings } from '@/types'
import { useTheme } from '@/context/theme-context'
import { apiSlug } from '@/app/api/apiUrl'
import { ThemedCard } from '../themed/card'
import { ThemedInput } from '../themed/input'
import { ThemedButton } from '../themed/button'
import { BusinessClosureCalendar } from '../BusinessClosureCalendar'
import { useSettings } from '@/context/settings-context'

export default function SettingsTab() {
  const { currentTheme } = useTheme()
  const {
    businessSlug,
    setBusinessSlug,
    company,
    closurePeriods,
    closureReason,
    setClosureReason,
    selectedClosureStartDate,
    selectedClosureEndDate,
    handleAddClosure,
    handleSaveSlug,
    deleteClosure,
    handleCalendarDates,
    loadingSlug,
    slugError,
    slugSuccess,
    loadingClosure
  } = useSettings()

  const [localSettings, setLocalSettings] = useState<CompanySettings>({
    id: '1',
    companyId: 'company-1',
    appointmentDuration: 30
  })
  const [copied, setCopied] = useState(false)

  const copySlugToClipboard = () => {
    const fullUrl = `${apiSlug}/reservas/${businessSlug}`
    navigator.clipboard.writeText(fullUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isFormValid =
    selectedClosureStartDate && selectedClosureEndDate && closureReason.trim()

  // Cálculos para el resumen
  const todayBookings = company?.bookings
    .filter((b) => b.date)
    .filter((b) => {
      const d = new Date(b.date as string)
      const today = new Date()
      return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      )
    }).length

  const weekBookings = (() => {
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())
    const endOfWeek = new Date(today)
    endOfWeek.setDate(today.getDate() + (6 - today.getDay()))
    return company?.bookings
      ?.filter((b) => b.date)
      .filter((b) => {
        const d = new Date(b.date as string)
        return d >= startOfWeek && d <= endOfWeek
      }).length
  })()

  const monthBookings = company?.bookings?.filter(
    (b) =>
      b.date &&
      new Date(b.date).getMonth() === new Date().getMonth() &&
      new Date(b.date).getFullYear() === new Date().getFullYear()
  ).length

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1
          className="text-2xl font-bold flex items-center gap-3"
          style={{ color: currentTheme.colors.text }}
        >
          <Settings
            className="h-6 w-6"
            style={{ color: currentTheme.colors.primary }}
          />
          Configuración de Negocio
        </h1>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Main Settings */}
        <div className="xl:col-span-2 space-y-6">
          {/* Basic Settings Card */}
          <ThemedCard className="p-6">
            <h2
              className="text-lg font-semibold mb-4 flex items-center gap-2"
              style={{ color: currentTheme.colors.text }}
            >
              <Settings
                className="h-5 w-5"
                style={{ color: currentTheme.colors.primary }}
              />
              Configuración Básica
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ThemedInput
                label="Duración por Defecto de Citas (minutos)"
                type="number"
                value={localSettings.appointmentDuration}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    appointmentDuration: Number(e.target.value)
                  })
                }
                min="15"
                step="15"
              />

              {/* Business Slug Section */}
              <div className="space-y-3">
                <label
                  className="block text-sm font-medium"
                  style={{ color: currentTheme.colors.text }}
                >
                  🔗 Enlace del Negocio
                </label>
                <div className="flex gap-2">
                  <ThemedInput
                    value={businessSlug}
                    onChange={(e) => setBusinessSlug(e.target.value)}
                    placeholder="mi-salon-belleza"
                    className="flex-1"
                    disabled={loadingSlug}
                  />
                  <ThemedButton
                    onClick={copySlugToClipboard}
                    variant="secondary"
                    disabled={loadingSlug}
                    size="sm"
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </ThemedButton>
                </div>
                <ThemedButton
                  onClick={handleSaveSlug}
                  variant="outline"
                  disabled={loadingSlug}
                  size="sm"
                  className="w-full"
                >
                  Guardar Enlace
                </ThemedButton>
                {slugError && (
                  <div className="text-red-600 text-sm">{slugError}</div>
                )}
                {slugSuccess && (
                  <div className="text-green-600 text-sm">{slugSuccess}</div>
                )}
              </div>
            </div>

            {/* URL Display */}
            <div
              className="mt-4 p-3 rounded-lg border"
              style={{
                backgroundColor: currentTheme.colors.primaryLight,
                borderColor: currentTheme.colors.primary
              }}
            >
              <p
                className="text-sm"
                style={{ color: currentTheme.colors.primaryDark }}
              >
                🌐 <strong>URL para clientes:</strong>
                <br className="sm:hidden" />
                <span className="font-mono ml-1 break-all">
                  {apiSlug}/reservas/{businessSlug}
                </span>
              </p>
            </div>
          </ThemedCard>

          {/* Business Closures Card */}
          <ThemedCard className="p-6">
            <h2
              className="text-lg font-semibold mb-4 flex items-center gap-2"
              style={{ color: currentTheme.colors.text }}
            >
              <Calendar
                className="h-5 w-5"
                style={{ color: currentTheme.colors.primary }}
              />
              Cierres por Vacaciones/Festivos
            </h2>

            <div className="space-y-6">
              <BusinessClosureCalendar onDateSelected={handleCalendarDates} />

              {selectedClosureStartDate && selectedClosureEndDate && (
                <div
                  className="border-2 border-dashed rounded-lg p-4 space-y-4"
                  style={{
                    borderColor: currentTheme.colors.border,
                    backgroundColor: currentTheme.colors.background + '50'
                  }}
                >
                  <ThemedInput
                    label="Motivo del cierre"
                    type="text"
                    value={closureReason}
                    onChange={(e) => setClosureReason(e.target.value)}
                    placeholder="Ej: Vacaciones de verano, Fiestas navideñas, Mantenimiento..."
                  />

                  <ThemedButton
                    onClick={handleAddClosure}
                    disabled={!isFormValid || loadingClosure}
                    className="w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {loadingClosure
                      ? 'Añadiendo...'
                      : 'Añadir Período de Cierre'}
                  </ThemedButton>
                </div>
              )}

              {!selectedClosureStartDate && (
                <div
                  className="border rounded-lg p-4"
                  style={{
                    backgroundColor: currentTheme.colors.primaryLight,
                    borderColor: currentTheme.colors.primary
                  }}
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle
                      className="h-4 w-4"
                      style={{ color: currentTheme.colors.primary }}
                    />
                    <p style={{ color: currentTheme.colors.primaryDark }}>
                      Selecciona las fechas en el calendario para configurar un
                      nuevo período de cierre.
                    </p>
                  </div>
                </div>
              )}

              {/* Lista de Períodos Configurados */}
              {closurePeriods.length > 0 && (
                <div className="space-y-3">
                  <h4
                    className="font-semibold flex items-center gap-2"
                    style={{ color: currentTheme.colors.text }}
                  >
                    <Calendar
                      className="h-4 w-4"
                      style={{ color: currentTheme.colors.success }}
                    />
                    Períodos de Cierre Configurados
                  </h4>
                  <div className="space-y-3">
                    {closurePeriods.map((period) => (
                      <div
                        key={period.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-lg border"
                        style={{
                          backgroundColor: currentTheme.colors.background,
                          borderColor: currentTheme.colors.border
                        }}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className="inline-flex items-center px-2 py-1 rounded-full text-s font-medium"
                              style={{
                                backgroundColor:
                                  currentTheme.colors.primary + '20',
                                color: currentTheme.colors.primary
                              }}
                            >
                              {new Date(period.startDate).toLocaleDateString(
                                'es-ES'
                              )}
                            </span>
                            <span
                              className="text-s"
                              style={{
                                color: currentTheme.colors.textSecondary
                              }}
                            >
                              hasta
                            </span>
                            <span
                              className="inline-flex items-center px-2 py-1 rounded-full text-s font-medium"
                              style={{
                                backgroundColor:
                                  currentTheme.colors.primary + '20',
                                color: currentTheme.colors.primary
                              }}
                            >
                              {new Date(period.endDate).toLocaleDateString(
                                'es-ES'
                              )}
                            </span>
                          </div>
                          <p
                            className="font-medium text-s"
                            style={{ color: currentTheme.colors.text }}
                          >
                            {period.reason}
                          </p>
                        </div>
                        <ThemedButton
                          onClick={() => deleteClosure(period.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 self-start sm:self-center"
                        >
                          <Trash2 className="h-4 w-4" />
                        </ThemedButton>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ThemedCard>
        </div>

        {/* Right Column - Summary Stats */}
        <div className="space-y-6">
          <ThemedCard
            className="p-6"
            style={{ background: currentTheme.gradients.background }}
          >
            <h3
              className="font-semibold mb-4 flex items-center gap-2"
              style={{ color: currentTheme.colors.text }}
            >
              <TrendingUp
                className="h-5 w-5"
                style={{ color: currentTheme.colors.success }}
              />
              Resumen del Sistema
            </h3>

            <div className="space-y-4">
              {/* Professionals */}
              <div
                className="flex items-center justify-between p-3 rounded-lg"
                style={{
                  backgroundColor: currentTheme.colors.background + '50'
                }}
              >
                <div className="flex items-center gap-3">
                  <Users
                    className="h-4 w-4"
                    style={{ color: currentTheme.colors.primary }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: currentTheme.colors.text }}
                  >
                    Profesionales
                  </span>
                </div>
                <span
                  className="font-semibold"
                  style={{ color: currentTheme.colors.text }}
                >
                  {company?.professionals.length}
                </span>
              </div>

              {/* Services */}
              <div
                className="flex items-center justify-between p-3 rounded-lg"
                style={{
                  backgroundColor: currentTheme.colors.background + '50'
                }}
              >
                <div className="flex items-center gap-3">
                  <Briefcase
                    className="h-4 w-4"
                    style={{ color: currentTheme.colors.primary }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: currentTheme.colors.text }}
                  >
                    Servicios
                  </span>
                </div>
                <span
                  className="font-semibold"
                  style={{ color: currentTheme.colors.text }}
                >
                  {company?.services.length}
                </span>
              </div>

              {/* Today's Bookings */}
              <div
                className="flex items-center justify-between p-3 rounded-lg"
                style={{
                  backgroundColor: currentTheme.colors.background + '50'
                }}
              >
                <div className="flex items-center gap-3">
                  <Calendar
                    className="h-4 w-4"
                    style={{ color: currentTheme.colors.success }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: currentTheme.colors.text }}
                  >
                    Reservas hoy
                  </span>
                </div>
                <span
                  className="font-semibold"
                  style={{ color: currentTheme.colors.success }}
                >
                  {todayBookings}
                </span>
              </div>

              {/* Week's Bookings */}
              <div
                className="flex items-center justify-between p-3 rounded-lg"
                style={{
                  backgroundColor: currentTheme.colors.background + '50'
                }}
              >
                <div className="flex items-center gap-3">
                  <Calendar
                    className="h-4 w-4"
                    style={{ color: currentTheme.colors.primary }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: currentTheme.colors.text }}
                  >
                    Esta semana
                  </span>
                </div>
                <span
                  className="font-semibold"
                  style={{ color: currentTheme.colors.text }}
                >
                  {weekBookings}
                </span>
              </div>

              {/* Month's Bookings */}
              <div
                className="flex items-center justify-between p-3 rounded-lg"
                style={{
                  backgroundColor: currentTheme.colors.background + '50'
                }}
              >
                <div className="flex items-center gap-3">
                  <Calendar
                    className="h-4 w-4"
                    style={{ color: currentTheme.colors.primary }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: currentTheme.colors.text }}
                  >
                    Este mes
                  </span>
                </div>
                <span
                  className="font-semibold"
                  style={{ color: currentTheme.colors.text }}
                >
                  {monthBookings}
                </span>
              </div>
            </div>
          </ThemedCard>
        </div>
      </div>
    </div>
  )
}
