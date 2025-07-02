'use client'

import { ProfessionalServices, Service } from '@/types'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useState
} from 'react'
import { useDashboard } from './dashboard-Context'
import { apiUrl } from '@/app/api/apiUrl'
import { CrudReducer } from '@/app/reducer/crudReducer'

type ServiceContextType = {
  handleAddService: (data: {
    name: string
    duration: number
    price: number
  }) => Promise<void>
  fetchServices: () => Promise<void>
  handleDeleteService: (id: string) => Promise<void>
  handleToggleProfessionalService: (
    serviceId: string,
    professionalId: string
  ) => Promise<void>
  professionalServices: ProfessionalServices[]
  loading: boolean
  error: string | null
  services: Service[]
}

const ServicesContext = createContext<ServiceContextType | undefined>(undefined)

export const useService = () => {
  const context = useContext(ServicesContext)
  if (!context)
    throw new Error(
      'useProfessionals debe usarse dentro de un ProfessionalsProvider'
    )
  return context
}

export const ServiceProvider = ({
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
  const [state, dispatch] = useReducer(CrudReducer<Service>, {
    items: [],
    loading: false,
    error: null
  })
  const [professionalServices, setProfessionalServices] = useState<
    ProfessionalServices[]
  >([])

  const fetchServices = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      if (!companyId) return
      const response = await fetch(`${apiUrl}/services/${companyId}`, {
        method: 'GET'
      })
      const data = await response.json()
      dispatch({ type: 'SET_ITEMS', payload: data })
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Error al cargar servicios' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const handleAddService = async (serviceData: {
    name: string
    duration: number
    price: number
  }) => {
    try {
      const res = await fetch(`${apiUrl}/services/${companyId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(serviceData)
      })
      const data = await res.json()
      dispatch({ type: 'ADD_ITEMS', payload: data })
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Error adding services' })
    }
  }

  const handleDeleteService = async (serviceId: string) => {
    try {
      const res = await fetch(`${apiUrl}/services/${serviceId}`, {
        method: 'DELETE'
      })
      if (!res.ok) {
        throw new Error(`Failed to delete service: ${res.statusText}`)
      }
      await res.json()
      dispatch({ type: 'REMOVE_ITEMS', payload: serviceId })
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Error deleting service:' })
    }
  }

  const fetchProfessionalServices = async () => {
    try {
      const res = await fetch(`${apiUrl}/services/assignments/${companyId}`)
      const data = await res.json()
      setProfessionalServices(data)
    } catch (err) {
      console.error('Error cargando relaciones servicio-profesional', err)
    }
  }

  const handleToggleProfessionalService = async (
    serviceId: string,
    professionalId: string
  ) => {
    const alreadyAssigned = professionalServices.some(
      (ps) => ps.serviceId === serviceId && ps.professionalId === professionalId
    )

    try {
      if (alreadyAssigned) {
        await fetch(`${apiUrl}/services/assignment`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ serviceId, professionalId })
        })
        setProfessionalServices((prev) =>
          prev.filter(
            (ps) =>
              !(
                ps.serviceId === serviceId &&
                ps.professionalId === professionalId
              )
          )
        )
      } else {
        await fetch(`${apiUrl}/services/assignment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ serviceId, professionalId })
        })
        setProfessionalServices((prev) => [
          ...prev,
          { serviceId, professionalId }
        ])
      }
    } catch {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Error toggling professional-service'
      })
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
    fetchServices()
    fetchProfessionalServices()
  }, [companyId])

  const { loading, error, items: services } = state

  return (
    <ServicesContext.Provider
      value={{
        handleAddService,
        fetchServices,
        handleDeleteService,
        handleToggleProfessionalService,
        professionalServices,
        loading,
        error,
        services
      }}
    >
      {children}
    </ServicesContext.Provider>
  )
}
