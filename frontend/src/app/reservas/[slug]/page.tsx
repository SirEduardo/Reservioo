'use client'
import { ThemeProvider, useTheme } from '@/context/theme-context'
import { ThemedCard } from '@/app/components/themed/card'
import { Booking, BusinessInfo, TimeSlot } from '@/types'
import { useProfessionals } from '@/context/professionals-context'
import { useService } from '@/context/services-context'
import {
  ServiceSelection,
  ProfessionalSelection,
  DateSelection,
  TimeSelection,
  PersonalDataForm,
  BookingConfirmation,
  BookingHeader
} from '@/app/components/booking'
import { apiUrl } from '@/app/api/apiUrl'
import { ProfessionalsProvider } from '@/context/professionals-context'
import { ServiceProvider } from '@/context/services-context'
import { ScheduleProvider } from '@/context/schedules-context'
import { useEffect, useState } from 'react'
import React from 'react'
import { useDashboard } from '@/context/dashboard-Context'
import { addMonths, subMonths } from 'date-fns'

function BookingContent({ slug }: { slug: string }) {
  const { currentTheme } = useTheme()
  const { professionals, loading: loadingProfessionals } = useProfessionals()
  const {
    services,
    professionalServices,
    loading: loadingServices
  } = useService()
  const [step, setStep] = useState(1)
  const [bookingData, setBookingData] = useState<Booking>({
    id: '',
    companyId: '',
    professionalId: null,
    date: null,
    serviceId: '',
    name: '',
    email: '',
    phone: ''
  })
  const [availableDates, setAvailableDates] = useState<Date[]>([])
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [companyData, setCompanyData] = useState<BusinessInfo | null>(null)
  const [companyId, setCompanyId] = useState<string | null>(null)
  const dashboard = useDashboard()
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth() + 1
  )
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  )

  // Obtener datos de la empresa basándose en el slug
  const fetchCompanyData = React.useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/book/${slug}/data`)

      if (response.ok) {
        const data = await response.json()
        setCompanyData(data)
        console.log('companyData', data)
      } else {
        const errorText = await response.text()
        console.error(
          'Error en fetchCompanyData:',
          response.status,
          response.statusText,
          errorText
        )
      }
    } catch (error) {
      console.error('Error al cargar datos de la empresa:', error)
    }
  }, [slug])

  // Obtener companyId por slug
  const fetchCompanyId = React.useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/public/company-by-slug/${slug}`)
      if (response.ok) {
        const data = await response.json()
        let cleanId = data.companyId
        if (typeof cleanId === 'string') {
          cleanId = cleanId.replace(/[[\]]/g, '')
        }
        setCompanyId(cleanId)
      } else {
        setCompanyId(null)
      }
    } catch {
      setCompanyId(null)
    }
  }, [slug])

  useEffect(() => {
    fetchCompanyData()
    fetchCompanyId()
  }, [fetchCompanyData, fetchCompanyId])

  const fetchAvailableDates = React.useCallback(
    async (professionalId: string | null, month: number, year: number) => {
      if (!month || !year) return []
      let url = `${apiUrl}/availability/days`
      if (professionalId) {
        url += `/${professionalId}`
      }
      url += `?month=${month}&year=${year}`
      if (bookingData.serviceId) {
        url += `&serviceId=${bookingData.serviceId}`
      }
      const res = await fetch(url)
      const dates = await res.json()
      return dates.map((d: string) => new Date(d))
    },
    [bookingData.serviceId]
  )

  useEffect(() => {
    if (bookingData.serviceId && currentMonth && currentYear) {
      fetchAvailableDates(
        bookingData.professionalId,
        currentMonth,
        currentYear
      ).then((dates) => {
        setAvailableDates(dates)
      })
      setBookingData((prev) => ({ ...prev, date: null }))
    }
  }, [
    bookingData.professionalId,
    bookingData.serviceId,
    fetchAvailableDates,
    currentMonth,
    currentYear
  ])

  // Cargar horarios disponibles cuando se selecciona una fecha
  const fetchAvailableHours = React.useCallback(
    async (professionalId: string | null, date: Date) => {
      if (!date) return []

      const dateStr = date.toISOString().split('T')[0]
      const serviceId = bookingData.serviceId

      if (!professionalId) {
        try {
          const res = await fetch(
            `${apiUrl}/availability/hours?date=${dateStr}&serviceId=${serviceId}`
          )

          if (!res.ok) {
            const errorText = await res.text()
            console.error('Error en API:', errorText)
            return []
          }

          const times = await res.json()
          return times.map((time: string) => ({
            time,
            available: true
          }))
        } catch (error) {
          console.error(
            'Error al obtener horarios para cualquier profesional:',
            error
          )
          return []
        }
      }

      try {
        const res = await fetch(
          `${apiUrl}/availability/hours/${professionalId}?date=${dateStr}&serviceId=${serviceId}`
        )

        if (!res.ok) {
          const errorText = await res.text()
          console.error('Error en API:', errorText)
          return []
        }

        const times = await res.json()

        return times.map((time: string) => ({
          time,
          available: true
        }))
      } catch (error) {
        console.error(
          'Error al obtener horarios para profesional específico:',
          error
        )
        return []
      }
    },
    [bookingData.serviceId]
  )

  useEffect(() => {
    if (bookingData.date) {
      setIsLoadingSlots(true)
      fetchAvailableHours(
        bookingData.professionalId,
        typeof bookingData.date === 'string'
          ? new Date(bookingData.date)
          : bookingData.date
      )
        .then((slots) => {
          setAvailableSlots(slots)
          setIsLoadingSlots(false)
        })
        .catch((error) => {
          console.error('Error al cargar horarios:', error)
          setAvailableSlots([])
          setIsLoadingSlots(false)
        })
    }
  }, [bookingData.date, bookingData.professionalId, fetchAvailableHours])

  const fetchAvailableProfessional = async (date: Date, time: string) => {
    const dateStr = date.toISOString().split('T')[0]
    const res = await fetch(
      `${apiUrl}/availability/professionals?date=${dateStr}&time=${time}`
    )
    return await res.json()
  }

  const handleServiceSelect = (serviceId: string) => {
    setBookingData((prev) => ({ ...prev, serviceId }))
  }

  const handleProfessionalSelect = (professionalId: string | null) => {
    setBookingData((prev) => ({ ...prev, professionalId }))
  }

  const handleDateSelect = (date: Date) => {
    setBookingData((prev) => ({ ...prev, date }))
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleInputChange = (field: string, value: string) => {
    setBookingData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!companyData)
        throw new Error('No se han cargado los datos de la empresa')
      if (!bookingData.date || !selectedTime)
        throw new Error('Selecciona fecha y hora')

      // Construir la fecha local solo aquí
      const dateObj =
        typeof bookingData.date === 'string'
          ? new Date(bookingData.date)
          : bookingData.date
      const [hours, minutes] = selectedTime.split(':').map(Number)
      const year = dateObj.getFullYear()
      const month = dateObj.getMonth()
      const day = dateObj.getDate()
      new Date(year, month, day, hours, minutes, 0, 0)

      const pad = (n: number) => n.toString().padStart(2, '0')
      const localDateString = `${year}-${pad(month + 1)}-${pad(
        day
      )}T${selectedTime}:00`

      const companyId =
        typeof companyData.company.id === 'string'
          ? companyData.company.id
          : dashboard?.companyId

      // Si no hay profesional seleccionado, usar createBookingAuto
      if (!bookingData.professionalId) {
        const requestBody = {
          serviceId: bookingData.serviceId,
          name: bookingData.name,
          email: bookingData.email,
          phone: bookingData.phone,
          date: localDateString
        }

        const response = await fetch(`${apiUrl}/bookings/auto/${companyId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error('Error response:', errorText)
          throw new Error(
            `Error al crear la reserva automática: ${response.status} ${response.statusText}`
          )
        }

        await response.json()
      } else {
        // Usar createBooking con profesional específico
        const requestBody = {
          professionalId: bookingData.professionalId,
          serviceId: bookingData.serviceId,
          name: bookingData.name,
          email: bookingData.email,
          phone: bookingData.phone,
          date: localDateString
        }

        const response = await fetch(`${apiUrl}/bookings/${companyId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error('Error response:', errorText)
          throw new Error(
            `Error al crear la reserva: ${response.status} ${response.statusText}`
          )
        }

        await response.json()
      }

      setIsLoading(false)
      setIsSubmitted(true)
    } catch (error) {
      console.error('Error al crear la reserva:', error)
      setIsLoading(false)
      // Aquí podrías mostrar un mensaje de error al usuario
      alert(
        `Error al crear la reserva: ${
          error instanceof Error ? error.message : 'Error desconocido'
        }`
      )
    }
  }

  const getSelectedService = () =>
    services.find((s) => s.id === bookingData.serviceId)
  const getSelectedProfessional = () => {
    if (!bookingData.professionalId) return null
    return professionals.find((p) => p.id === bookingData.professionalId)
  }

  const handleNewBooking = () => {
    window.location.reload()
  }

  // filtro de profesionales
  const filteredProfessionals = bookingData.serviceId
    ? professionals.filter((pro) =>
        professionalServices.some(
          (ps) =>
            ps.professionalId === pro.id &&
            ps.serviceId === bookingData.serviceId
        )
      )
    : professionals

  const handleMonthChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      const prev = subMonths(new Date(currentYear, currentMonth - 1), 1)
      setCurrentMonth(prev.getMonth() + 1)
      setCurrentYear(prev.getFullYear())
    } else {
      const next = addMonths(new Date(currentYear, currentMonth - 1), 1)
      setCurrentMonth(next.getMonth() + 1)
      setCurrentYear(next.getFullYear())
    }
  }

  // Define la función fuera del JSX
  const handleTimeContinue = async () => {
    if (bookingData.date && selectedTime) {
      const [hours, minutes] = selectedTime.split(':').map(Number)
      const dateObj =
        typeof bookingData.date === 'string'
          ? new Date(bookingData.date)
          : bookingData.date
      const fullDate = new Date(
        dateObj.getFullYear(),
        dateObj.getMonth(),
        dateObj.getDate(),
        hours,
        minutes,
        0,
        0
      )
      setBookingData((prev) => ({ ...prev, date: fullDate }))
      // Si no hay profesional seleccionado, llamar a fetchAvailableProfessional
      if (!bookingData.professionalId) {
        await fetchAvailableProfessional(fullDate, selectedTime)
        // Aquí puedes mostrar un modal, sugerencia, etc. si lo deseas
      }
    }
    setStep(5)
  }

  // Mostrar loading hasta que companyId esté listo y sea válido
  if (
    !companyId ||
    companyId === 'null' ||
    companyId === 'undefined' ||
    companyId === ''
  ) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        Cargando datos de la empresa...
      </div>
    )
  }

  console.log(bookingData)

  if (isSubmitted) {
    return (
      <div
        className="min-h-screen p-4"
        style={{ background: currentTheme.colors.background }}
      >
        <div className="max-w-2xl mx-auto pt-20">
          <ThemedCard>
            <BookingConfirmation
              bookingData={{
                ...bookingData,
                date:
                  typeof bookingData.date === 'string'
                    ? new Date(bookingData.date)
                    : bookingData.date
              }}
              selectedService={getSelectedService()}
              selectedProfessional={getSelectedProfessional()}
              onNewBooking={handleNewBooking}
              currentTheme={currentTheme}
            />
          </ThemedCard>
        </div>
      </div>
    )
  }

  if (loadingProfessionals || loadingServices) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        Cargando datos de la empresa...
      </div>
    )
  }

  return (
    <ProfessionalsProvider companyId={companyId}>
      <ServiceProvider companyId={companyId}>
        <ScheduleProvider companyId={companyId}>
          <ThemeProvider>
            <div
              className="min-h-screen p-4"
              style={{ background: currentTheme.colors.background }}
            >
              <div className="max-w-2xl mx-auto pt-20">
                <ThemedCard>
                  {companyData && (
                    <BookingHeader
                      currentStep={step}
                      businessInfo={companyData}
                      currentTheme={currentTheme}
                    />
                  )}
                  {step === 1 && (
                    <ServiceSelection
                      services={services}
                      selectedServiceId={bookingData.serviceId}
                      onServiceSelect={handleServiceSelect}
                      onContinue={() => setStep(2)}
                      currentTheme={currentTheme}
                    />
                  )}
                  {step === 2 && (
                    <ProfessionalSelection
                      professionals={filteredProfessionals}
                      selectedProfessionalId={bookingData.professionalId}
                      onProfessionalSelect={(professionalId) =>
                        handleProfessionalSelect(professionalId)
                      }
                      onBack={() => setStep(1)}
                      onContinue={() => setStep(3)}
                      currentTheme={currentTheme}
                    />
                  )}
                  {step === 3 && (
                    <DateSelection
                      availableDates={availableDates}
                      selectedDate={
                        bookingData.date
                          ? typeof bookingData.date === 'string'
                            ? new Date(bookingData.date)
                            : bookingData.date
                          : null
                      }
                      selectedProfessional={professionals.find(
                        (p) => p.id === bookingData.professionalId
                      )}
                      onDateSelect={handleDateSelect}
                      onBack={() => setStep(step - 1)}
                      onContinue={() => setStep(step + 1)}
                      currentTheme={currentTheme}
                      currentMonth={currentMonth}
                      currentYear={currentYear}
                      onMonthChange={handleMonthChange}
                    />
                  )}
                  {step === 4 && (
                    <TimeSelection
                      availableSlots={availableSlots}
                      selectedTime={selectedTime}
                      selectedProfessionalId={bookingData.professionalId}
                      isLoadingSlots={isLoadingSlots}
                      onTimeSelect={handleTimeSelect}
                      onBack={() => setStep(3)}
                      onContinue={handleTimeContinue}
                      onBackToDate={() => setStep(3)}
                      onBackToProfessional={() => setStep(2)}
                      currentTheme={currentTheme}
                    />
                  )}
                  {step === 5 && (
                    <PersonalDataForm
                      bookingData={{
                        ...bookingData,
                        date:
                          typeof bookingData.date === 'string'
                            ? new Date(bookingData.date)
                            : bookingData.date
                      }}
                      selectedService={getSelectedService()}
                      selectedProfessional={getSelectedProfessional()}
                      isLoading={isLoading}
                      onInputChange={handleInputChange}
                      onSubmit={handleSubmit}
                      onBack={() => setStep(4)}
                      currentTheme={currentTheme}
                    />
                  )}
                </ThemedCard>
              </div>
            </div>
          </ThemeProvider>
        </ScheduleProvider>
      </ServiceProvider>
    </ProfessionalsProvider>
  )
}

export default function BookingPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = React.use(params)
  return (
    <ThemeProvider>
      <BookingContent slug={slug} />
    </ThemeProvider>
  )
}
