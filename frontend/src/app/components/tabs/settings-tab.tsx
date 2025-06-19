'use client'

import { useState, useEffect } from 'react'
import { Settings, Copy, Check } from 'lucide-react'
import { Booking, CompanySettings } from '@/types'
import { ThemedButton } from './themed/button'
import { ThemedCard } from './themed/card'
import { ThemedInput } from './themed/input'
import { useTheme } from '@/context/theme-context'
import { useProfessionals } from '@/context/professionals-context'
import { useService } from '@/context/services-context'
import { useSchedule } from '@/context/schedules-context'
import { apiSlug, apiUrl } from '../api/apiUrl'
import { useDashboard } from '@/context/dashboard-Context'

interface SettingsTabProps {
  settings: CompanySettings
  bookings: Booking[]
  onUpdateSettings: (settings: CompanySettings) => void
}

export default function SettingsTab({
  settings,
  bookings,
  onUpdateSettings
}: SettingsTabProps) {
  const { currentTheme } = useTheme()
  const { professionals } = useProfessionals()
  const { services } = useService()
  const { schedules, scheduleProfessionals } = useSchedule()
  const { companyId } = useDashboard()
  const [localSettings, setLocalSettings] = useState(settings)
  const [businessSlug, setBusinessSlug] = useState('')
  const [copied, setCopied] = useState(false)
  const [slugError, setSlugError] = useState('')
  const [slugSuccess, setSlugSuccess] = useState('')
  const [loadingSlug, setLoadingSlug] = useState(false)

  useEffect(() => {
    const fetchSlug = async () => {
      if (!companyId) return
      setLoadingSlug(true)
      try {
        const res = await fetch(`${apiUrl}/business/${companyId}`)
        if (res.ok) {
          const data = await res.json()
          setBusinessSlug(data.slug || '')
        }
      } finally {
        setLoadingSlug(false)
      }
    }
    fetchSlug()
  }, [companyId])

  const handleSave = () => {
    onUpdateSettings(localSettings)
  }

  const handleSaveSlug = async () => {
    setSlugError('')
    setSlugSuccess('')
    if (!companyId) {
      setSlugError('No se ha identificado la empresa')
      return
    }
    setLoadingSlug(true)
    try {
      const res = await fetch(`${apiUrl}/business/${companyId}/slug`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: businessSlug })
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setSlugError(data.message || 'Error al actualizar el slug')
        setLoadingSlug(false)
        return
      }
      const data = await res.json()
      setBusinessSlug(data.slug)
      setSlugSuccess('¡Slug actualizado correctamente!')
      setTimeout(() => setSlugSuccess(''), 2000)
    } catch (err) {
      setSlugError('Error de red al actualizar el slug')
    } finally {
      setLoadingSlug(false)
    }
  }

  const copySlugToClipboard = () => {
    const fullUrl = `${apiSlug}/reservas/${businessSlug}`
    navigator.clipboard.writeText(fullUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <ThemedCard className="p-6">
        <h2
          className="text-xl font-bold mb-6 flex items-center gap-2"
          style={{ color: currentTheme.colors.text }}
        >
          <Settings
            className="h-5 w-5"
            style={{ color: currentTheme.colors.primary }}
          />
          Configuración de Citas
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
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

            <ThemedInput
              label="Tiempo de Buffer entre Citas (minutos)"
              type="number"
              value={localSettings.appointmentBuffer}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  appointmentBuffer: Number(e.target.value)
                })
              }
              min="0"
              step="5"
            />

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: currentTheme.colors.text }}
              >
                🔗 Slug del Negocio
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
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
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copied ? '¡Copiado!' : 'Copiar'}
                </ThemedButton>
                <ThemedButton
                  onClick={handleSaveSlug}
                  variant="outline"
                  disabled={loadingSlug}
                >
                  Guardar slug
                </ThemedButton>
              </div>
              {slugError && (
                <div className="text-red-600 text-sm mt-2">{slugError}</div>
              )}
              {slugSuccess && (
                <div className="text-green-600 text-sm mt-2">{slugSuccess}</div>
              )}
              <div
                className="mt-3 p-3 rounded-xl border"
                style={{
                  backgroundColor: currentTheme.colors.primaryLight,
                  borderColor: currentTheme.colors.primary
                }}
              >
                <p
                  className="text-sm break-all"
                  style={{ color: currentTheme.colors.primaryDark }}
                >
                  🌐 <strong>URL para clientes:</strong>
                  <br className="sm:hidden" />
                  <span className="font-mono ml-1">
                    {apiSlug}/{businessSlug}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <ThemedCard
            className="p-6"
            style={{ background: currentTheme.gradients.background }}
          >
            <h3
              className="font-semibold mb-4"
              style={{ color: currentTheme.colors.text }}
            >
              Resumen del Sistema
            </h3>
            <div className="space-y-3 text-sm">
              <div
                className="flex justify-between"
                style={{ color: currentTheme.colors.text }}
              >
                <span>Profesionales:</span>
                <span className="font-semibold">{professionals.length}</span>
              </div>
              <div
                className="flex justify-between"
                style={{ color: currentTheme.colors.text }}
              >
                <span>Servicios:</span>
                <span className="font-semibold">{services.length}</span>
              </div>
              <div
                className="flex justify-between"
                style={{ color: currentTheme.colors.text }}
              >
                <span>Horarios configurados:</span>
                <span className="font-semibold">{schedules.length}</span>
              </div>
              <div
                className="flex justify-between"
                style={{ color: currentTheme.colors.text }}
              >
                <span>Reservas totales:</span>
                <span className="font-semibold">{bookings.length}</span>
              </div>
              <div
                className="flex justify-between"
                style={{ color: currentTheme.colors.text }}
              >
                <span>Asignaciones activas:</span>
                <span className="font-semibold">
                  {scheduleProfessionals.length}
                </span>
              </div>
              <div
                className="flex justify-between"
                style={{ color: currentTheme.colors.text }}
              >
                <span>Precio promedio:</span>
                <span
                  className="font-semibold"
                  style={{ color: currentTheme.colors.success }}
                >
                  €
                  {services.length > 0
                    ? (
                        services.reduce((acc, s) => acc + s.price, 0) /
                        services.length
                      ).toFixed(2)
                    : '0.00'}
                </span>
              </div>
            </div>
          </ThemedCard>
        </div>

        <ThemedButton onClick={handleSave} size="lg" className="mt-6">
          ✨ Guardar Configuración
        </ThemedButton>
      </ThemedCard>
    </div>
  )
}
