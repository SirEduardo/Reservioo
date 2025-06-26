import { ThemeProvider } from '@/context/theme-context'
import { useState } from 'react'
import { DateSelection } from '../DateSelection'
import { fireEvent, render, screen } from '@testing-library/react'

const dateMocks = [
  new Date(2025, 5, 29), // Junio (mes 5 base 0, currentMonth=6 base 1)
  new Date(2025, 6, 28), // Julio (mes 6 base 0, currentMonth=7 base 1)
  new Date(2025, 7, 5), // Agosto (mes 7 base 0, currentMonth=8 base 1)
  new Date(2025, 7, 10) // Agosto (mes 7 base 0, currentMonth=8 base 1)
]

function Wrapper({
  onBack,
  onContinue
}: {
  onBack: () => void
  onContinue: () => void
}) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [currentMonth, setCurrentMonth] = useState(6)
  const [currentYear, setCurrentYear] = useState(2025)
  const onDateSelect = (date: Date) => setSelectedDate(date)
  const onMonthChange = (direction: 'prev' | 'next') => {
    if (direction === 'next') {
      if (currentMonth === 12) {
        setCurrentMonth(1)
        setCurrentYear(currentYear + 1)
      } else {
        setCurrentMonth(currentMonth + 1)
      }
    } else {
      if (currentMonth === 1) {
        setCurrentMonth(12)
        setCurrentYear(currentYear - 1)
      } else {
        setCurrentMonth(currentMonth - 1)
      }
    }
  }

  return (
    <ThemeProvider>
      <DateSelection
        availableDates={dateMocks}
        selectedDate={selectedDate}
        onDateSelect={onDateSelect}
        onBack={onBack}
        onContinue={onContinue}
        currentTheme={{
          colors: {
            primary: '#000',
            primaryLight: '#eee',
            surface: '#fff',
            border: '#ccc',
            text: '#000',
            textSecondary: '#666'
          }
        }}
        selectedProfessional={null} // or a mock Professional object if required
        currentMonth={currentMonth}
        currentYear={currentYear}
        onMonthChange={onMonthChange}
      ></DateSelection>
    </ThemeProvider>
  )
}

describe('DateSelection', () => {
  it('permite navegar entre meses y seleccionar días', () => {
    const onBack = jest.fn()
    const onContinue = jest.fn()
    render(<Wrapper onBack={onBack} onContinue={onContinue} />)

    // Mes inicial: Junio (currentMonth={6}, base 1)
    expect(screen.getByText(/junio/i)).toBeInTheDocument()

    // Navega a Julio
    fireEvent.click(screen.getByLabelText('Mes siguiente'))
    expect(screen.getByText(/julio/i)).toBeInTheDocument()

    // Navega a Agosto
    fireEvent.click(screen.getByLabelText('Mes siguiente'))
    expect(screen.getByText(/agosto/i)).toBeInTheDocument()

    // Vuelve a junio
    fireEvent.click(screen.getByLabelText('Mes anterior'))
    fireEvent.click(screen.getByLabelText('Mes anterior'))
    expect(screen.getByText(/junio/i)).toBeInTheDocument()

    const dayButton = screen
      .getAllByRole('button')
      .find((btn) => btn.textContent?.includes('29'))
    expect(dayButton).toBeDefined()
    if (dayButton) {
      fireEvent.click(dayButton)
    }
    fireEvent.click(screen.getByText(/continuar/i))
    expect(onContinue).toHaveBeenCalled()

    fireEvent.click(screen.getByText(/atrás/i))
    expect(onBack).toHaveBeenCalled()
  })
})
