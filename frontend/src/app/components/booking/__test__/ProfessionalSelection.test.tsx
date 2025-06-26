import { useState } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '@/context/theme-context'
import { ProfessionalSelection } from '../ProfessionalSelection'

const mockProfessionals = [
  { id: '1', name: 'Carlos', companyId: '123', services: [] },
  { id: '2', name: 'Marcos', companyId: '123', services: [] }
]

function Wrapper({
  onBack,
  onContinue
}: {
  onBack: () => void
  onContinue: () => void
}) {
  const [selectedProfessionalId, setSelectedProfessionalId] = useState('')
  const onProfessionalSelect = (id: string | null) =>
    setSelectedProfessionalId(id ?? '')

  return (
    <ThemeProvider>
      <ProfessionalSelection
        professionals={mockProfessionals}
        selectedProfessionalId={selectedProfessionalId}
        onProfessionalSelect={onProfessionalSelect}
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
      ></ProfessionalSelection>
    </ThemeProvider>
  )
}

describe('ProfessionalSelection', () => {
  it('Deberia renderizar los profesionales y permitir continuar e ir atrás', () => {
    const onContinue = jest.fn()
    const onBack = jest.fn()
    render(<Wrapper onBack={onBack} onContinue={onContinue} />)

    expect(screen.getByText('Marcos')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Marcos'))
    fireEvent.click(screen.getByText(/continuar/i))
    expect(onContinue).toHaveBeenCalled()

    fireEvent.click(screen.getByText(/atrás/i))
    expect(onBack).toHaveBeenCalled()
  })
})
