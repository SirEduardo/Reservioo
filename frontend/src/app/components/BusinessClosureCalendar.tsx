'use client'

import { useState } from 'react'
import Calendar from 'react-calendar'
import type { Value } from 'react-calendar/dist/shared/types.js'
import 'react-calendar/dist/Calendar.css'

interface BusinessClosureCalendarProps {
  onDateSelected: (startDate: Date | null, endDate: Date | null) => void
}

export function BusinessClosureCalendar({
  onDateSelected
}: BusinessClosureCalendarProps) {
  const [dateRange, setDateRange] = useState<Value | null>(null)

  const handleSelect = (value: Value) => {
    setDateRange(value)
    if (Array.isArray(value) && value.length === 2) {
      onDateSelected(value[0], value[1])
    } else if (value instanceof Date) {
      onDateSelected(value, value)
    } else {
      onDateSelected(null, null)
    }
  }

  const formatDateRange = () => {
    if (dateRange && Array.isArray(dateRange) && dateRange.length === 2) {
      const startDate = dateRange[0]?.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      const endDate = dateRange[1]?.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      return { startDate, endDate, isRange: true }
    } else if (dateRange && !Array.isArray(dateRange)) {
      const singleDate = dateRange.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      return { startDate: singleDate, endDate: null, isRange: false }
    }
    return null
  }

  const dateInfo = formatDateRange()

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 text-center">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center justify-center gap-2">
          <svg
            className="h-5 w-5 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Selecciona las fechas de cierre
        </h2>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        <div className="flex justify-center">
          <div className="calendar-container">
            <Calendar
              onChange={handleSelect}
              value={dateRange}
              selectRange={true}
              locale="es"
              className="rounded-lg border shadow-sm"
            />
          </div>
        </div>

        {dateInfo && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg
                className="h-5 w-5 text-blue-600 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-900">
                  {dateInfo.isRange
                    ? 'Período de cierre seleccionado'
                    : 'Fecha de cierre seleccionada'}
                </h4>
                {dateInfo.isRange ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300">
                        Inicio
                      </span>
                      <span className="text-sm font-medium capitalize">
                        {dateInfo.startDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-300">
                        Fin
                      </span>
                      <span className="text-sm font-medium capitalize">
                        {dateInfo.endDate}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-300">
                      Fecha
                    </span>
                    <span className="text-sm font-medium capitalize">
                      {dateInfo.startDate}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
