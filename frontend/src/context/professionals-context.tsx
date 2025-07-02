'use client'

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useReducer
} from 'react'
import { useDashboard } from './dashboard-Context'
import { Professional } from '@/types'
import { apiUrl } from '@/app/api/apiUrl'
import { CrudReducer } from '@/app/reducer/crudReducer'

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
  children,
  companyId: companyIdProp
}: {
  children: ReactNode
  companyId?: string
}) => {
  const dashboard = useDashboard()
  const companyId =
    typeof companyIdProp === 'string' && companyIdProp
      ? companyIdProp
      : dashboard?.companyId
  const [state, dispatch] = useReducer(CrudReducer<Professional>, {
    items: [],
    loading: false,
    error: null
  })

  const fetchProfessionals = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      if (!companyId) return
      const response = await fetch(`${apiUrl}/professionals/${companyId}`, {
        method: 'GET'
      })
      const data = await response.json()
      dispatch({ type: 'SET_ITEMS', payload: data })
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Error al cargar profesionales' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
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
      dispatch({ type: 'ADD_ITEMS', payload: data })
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Error adding professional' })
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

      await response.json()
      dispatch({ type: 'REMOVE_ITEMS', payload: professionalId })
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Error eliminando profesional' })
    }
  }

  useEffect(() => {
    if (
      !companyId ||
      companyId === 'null' ||
      companyId === 'undefined' ||
      companyId === ''
    )
      return
    fetchProfessionals()
  }, [companyId])

  const { loading, error, items: professionals } = state

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
