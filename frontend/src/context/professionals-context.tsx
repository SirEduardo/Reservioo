'use client'

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect
} from 'react'
import { useDashboard } from './dashboard-Context'
import { Professional } from '@/types'
import { apiUrl } from '@/app/api/apiUrl'

type ProfessionalContextType = {
  professionals: Professional[]
  loading: boolean
  error: string | null
  fetchProfessionals: () => Promise<void>
  handleAddProfessional: (professional: string) => Promise<void>
  handleDeleteProfessional: (id: string) => Promise<void>
}

const ProfessionalsContext = createContext<ProfessionalContextType | undefined>(
  undefined
)

export const useProfessionals = () => {
  const context = useContext(ProfessionalsContext)
  if (!context)
    throw new Error(
      'useProfessionals debe usarse dentro de un ProfessionalsProvider'
    )
  return context
}

export const ProfessionalsProvider = ({
  children
}: {
  children: ReactNode
}) => {
  const { companyId } = useDashboard()
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfessionals = async () => {
    setLoading(true)
    try {
      if (!companyId) return
      const response = await fetch(`${apiUrl}/professionals/${companyId}`, {
        method: 'GET'
      })
      const data = await response.json()
      setProfessionals(data)
      console.log(data)
    } catch (error) {
      setError('Error al cargar profesionales')
    } finally {
      setLoading(false)
    }
  }
  const handleAddProfessional = async (name: string) => {
    if (!companyId) return
    try {
      const response = await fetch(`${apiUrl}/professionals/${companyId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
      })
      const data = await response.json()
      setProfessionals((professionals) => [...professionals, data])
    } catch (error) {
      setError('Error adding professional')
    }
  }
  const handleDeleteProfessional = async (professionalId: string) => {
    try {
      const response = await fetch(`${apiUrl}/professional/${professionalId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error(`Failed to delete professional: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('Professional deleted:', data)

      setProfessionals((prevProfessionals) =>
        prevProfessionals.filter(
          (professional) => professional.id !== professionalId
        )
      )
    } catch (error) {
      setError('Error deleting professional:')
    }
  }

  useEffect(() => {
    fetchProfessionals()
  }, [companyId])

  return (
    <ProfessionalsContext.Provider
      value={{
        loading,
        error,
        professionals,
        handleAddProfessional,
        fetchProfessionals,
        handleDeleteProfessional
      }}
    >
      {children}
    </ProfessionalsContext.Provider>
  )
}
