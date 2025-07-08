'use client'

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer
} from 'react'
import { useDashboard } from './dashboard-Context'
import { BusinessClosure, BusinessInfo } from '@/types'
import { apiUrl } from '@/app/api/apiUrl'
import { SettingsReducer, SettingsState } from '@/app/reducer/settingsReducer'

const initialState: SettingsState = {
  businessSlug: '',
  company: null,
  slugError: null,
  slugSuccess: '',
  loadingSlug: false,
  selectedClosureStartDate: null,
  selectedClosureEndDate: null,
  closureReason: '',
  closurePeriods: [],
  loadingClosure: false
}

type SettingsContextProps = {
  handleAddClosure: () => void
  handleSaveSlug: () => void
  businessSlug: string
  setBusinessSlug: (slug: string) => void
  closurePeriods: BusinessClosure[]
  closureReason: string
  setClosureReason: (reason: string) => void
  company: BusinessInfo | null
  deleteClosure: (id: string) => void
  selectedClosureStartDate: Date | null
  selectedClosureEndDate: Date | null
  handleCalendarDates: (startDate: Date | null, endDate: Date | null) => void
  loadingSlug: boolean
  slugError: string | null
  slugSuccess: string
  loadingClosure: boolean
}

const SettingsContext = createContext<SettingsContextProps | undefined>(
  undefined
)

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) throw new Error('useSettigns debe usarse dentro de un provider')
  return context
}

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const { companyId } = useDashboard()

  const [state, dispatch] = useReducer(SettingsReducer, initialState)
  const {
    businessSlug,
    company,
    slugError,
    slugSuccess,
    loadingSlug,
    selectedClosureStartDate,
    selectedClosureEndDate,
    closureReason,
    closurePeriods,
    loadingClosure
  } = state

  const fetchSlug = async () => {
    if (!companyId) return
    dispatch({ type: 'SET_LOADING_SLUG', payload: true })
    try {
      const res = await fetch(`${apiUrl}/business/${companyId}`)
      if (res.ok) {
        const data = await res.json()
        console.log(data)

        dispatch({ type: 'SET_SLUG', payload: data.slug || '' })
        dispatch({ type: 'ADD_CLOSURE', payload: data.businessClosure })
        dispatch({ type: 'SET_COMPANY', payload: data })
      }
    } finally {
      dispatch({ type: 'SET_LOADING_SLUG', payload: false })
    }
  }
  const handleAddClosure = async () => {
    console.log({
      selectedClosureStartDate,
      selectedClosureEndDate,
      closureReason
    })
    if (
      selectedClosureStartDate &&
      selectedClosureEndDate &&
      closureReason.trim()
    ) {
      dispatch({ type: 'SET_LOADING_CLOSURE', payload: true })
      try {
        const response = await fetch(
          `${apiUrl}/business-closures/${companyId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              startDate: selectedClosureStartDate,
              endDate: selectedClosureEndDate,
              reason: closureReason.trim()
            })
          }
        )

        if (response.ok) {
          const newClosure: BusinessClosure = await response.json()
          dispatch({ type: 'ADD_CLOSURE', payload: newClosure })
          dispatch({ type: 'RESET_CLOSURE_FORM' })
          alert('¡Cierre añadido con éxito!')
        } else {
          alert('Error al añadir el cierre.')
        }
      } catch (error) {
        console.error('Error al añadir cierre:', error)
        alert('Hubo un problema al conectar con el servidor.')
      } finally {
        dispatch({ type: 'SET_LOADING_CLOSURE', payload: false })
      }
    } else {
      alert('Por favor, selecciona un rango de fechas y añade un motivo.')
    }
  }
  const handleSaveSlug = async () => {
    dispatch({ type: 'SET_SLUG_ERROR', payload: null })
    dispatch({ type: 'SET_SLUG_SUCCESS', payload: '' })
    if (!companyId) {
      dispatch({
        type: 'SET_SLUG_ERROR',
        payload: 'No se ha identificado la empresa'
      })
      return
    }
    dispatch({ type: 'SET_LOADING_SLUG', payload: true })
    try {
      const res = await fetch(`${apiUrl}/business/${companyId}/slug`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: businessSlug })
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        dispatch({
          type: 'SET_SLUG_ERROR',
          payload: data.message || 'Error al actualizar el slug'
        })
        dispatch({ type: 'SET_LOADING_SLUG', payload: false })
        return
      }
      const data = await res.json()
      dispatch({ type: 'SET_SLUG', payload: data.slug })
      dispatch({
        type: 'SET_SLUG_SUCCESS',
        payload: '¡Slug actualizado correctamente!'
      })
    } catch {
      dispatch({
        type: 'SET_SLUG_ERROR',
        payload: 'Error de red al actualizar el slug'
      })
    } finally {
      dispatch({ type: 'SET_LOADING_SLUG', payload: false })
    }
  }
  const deleteClosure = async (closureId: string) => {
    const response = await fetch(`${apiUrl}/business-closure/${closureId}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      throw new Error(`Failed to delete closure: ${response.statusText}`)
    }
    await response.json()
    dispatch({ type: 'DELETE_CLOSURE', payload: closureId })
  }

  const handleCalendarDates = (
    startDate: Date | null,
    endDate: Date | null
  ) => {
    dispatch({
      type: 'SET_SELECTED_CLOSURE_DATES',
      payload: { startDate, endDate }
    })
  }

  useEffect(() => {
    fetchSlug()
  }, [companyId])

  return (
    <SettingsContext.Provider
      value={{
        businessSlug,
        setBusinessSlug: (slug: string) =>
          dispatch({ type: 'SET_SLUG', payload: slug }),
        closurePeriods,
        closureReason,
        setClosureReason: (reason: string) =>
          dispatch({ type: 'SET_CLOSURE_REASON', payload: reason }),
        company,
        selectedClosureStartDate,
        selectedClosureEndDate,
        handleCalendarDates,
        handleAddClosure,
        handleSaveSlug,
        deleteClosure,
        loadingSlug,
        slugError,
        slugSuccess,
        loadingClosure
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
