'use client'

import { BusinessInfo, Theme } from '@/types'

interface BookingHeaderProps {
  currentStep: number
  businessInfo: BusinessInfo
  currentTheme: Theme
}

export function BookingHeader({
  currentStep,
  businessInfo,
  currentTheme
}: BookingHeaderProps) {
  return (
    <>
      {/* Header */}
      <div
        className="border-b"
        style={{
          backgroundColor: currentTheme.colors.surface,
          borderColor: currentTheme.colors.border
        }}
      >
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: currentTheme.colors.text }}
            >
              Haz tu reserva ya
            </h1>
            <p
              className="text-"
              style={{ color: currentTheme.colors.textSecondary }}
            >
              {businessInfo.company.name}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 py-6">
        {/* Progress Steps */}
        <div className="flex justify-center mb-2">
          <div className="flex items-center space-x-2 sm:space-x-4">
            {[1, 2, 3, 4, 5].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                    stepNumber <= currentStep ? 'text-white shadow-md' : ''
                  }`}
                  style={{
                    backgroundColor:
                      stepNumber <= currentStep
                        ? currentTheme.colors.primary
                        : currentTheme.colors.border,
                    color:
                      stepNumber <= currentStep
                        ? 'white'
                        : currentTheme.colors.textSecondary
                  }}
                >
                  {stepNumber}
                </div>
                {stepNumber < 5 && (
                  <div
                    className="w-4 sm:w-8 h-1 mx-1 sm:mx-2 rounded transition-all duration-300"
                    style={{
                      backgroundColor:
                        stepNumber < currentStep
                          ? currentTheme.colors.primary
                          : currentTheme.colors.border
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
