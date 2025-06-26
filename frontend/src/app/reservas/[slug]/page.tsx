'use client'
import { ThemeProvider, useTheme } from '@/context/theme-context'
import { ThemedCard } from '@/app/components/themed/card'
import { Booking, Professional, Service } from '@/types'
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
import { useState } from 'react'
import React from 'react'
import { useDashboard } from '@/context/dashboard-Context'
import { addMonths, subMonths } from 'date-fns'
import { useAvailability } from '@/app/customHooks/useAvailability'
import { useCompanyData } from '@/app/customHooks/useCompanyData'

function BookingContent({ slug }: { slug: string }) {
  const { currentTheme } = useTheme()
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
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const dashboard = useDashboard()
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth() + 1
  )
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  )
  const { companyData } = useCompanyData(slug)
  const {
    availableDates,
    availableSlots,
    isLoadingSlots,
    fetchAvailableProfessional
  } = useAvailability(bookingData, currentMonth, currentYear)

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
    companyData?.services.find((s: Service) => s.id === bookingData.serviceId)
  const getSelectedProfessional = () => {
    if (!bookingData.professionalId) return null
    return companyData?.professionals.find(
      (p: Professional) => p.id === bookingData.professionalId
    )
  }

  const handleNewBooking = () => {
    window.location.reload()
  }

  // filtro de profesionales
  const filteredProfessionals =
    companyData && bookingData.serviceId
      ? companyData.professionals.filter((pro: Professional) =>
          pro.services.some((s: Service) => s.id === bookingData.serviceId)
        )
      : companyData && companyData.professionals
      ? (companyData.professionals as Professional[])
      : []

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

  console.log('Render principal', { step, companyData })
  if (!companyData) {
    return <div>Cargando datos de la empresa...</div>
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

  return (
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
            {step === 1 && companyData && (
              <ServiceSelection
                services={companyData.services}
                selectedServiceId={bookingData.serviceId}
                onServiceSelect={handleServiceSelect}
                onContinue={() => setStep(2)}
                currentTheme={currentTheme}
              />
            )}
            {step === 2 && companyData && (
              <ProfessionalSelection
                professionals={filteredProfessionals}
                selectedProfessionalId={bookingData.professionalId}
                onProfessionalSelect={handleProfessionalSelect}
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
                selectedProfessional={
                  companyData &&
                  companyData.professionals.find(
                    (p: Professional) => p.id === bookingData.professionalId
                  )
                }
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
                selectedService={
                  companyData
                    ? companyData.services.find(
                        (s: Service) => s.id === bookingData.serviceId
                      )
                    : undefined
                }
                selectedProfessional={
                  companyData
                    ? companyData.professionals.find(
                        (p: Professional) => p.id === bookingData.professionalId
                      )
                    : undefined
                }
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
