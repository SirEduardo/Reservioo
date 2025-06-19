'use client'

import { ProfessionalServices, Service } from '@/types'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'
import { useDashboard } from './dashboard-Context'
import { apiUrl } from '@/app/api/apiUrl'

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
  const companyId =
    typeof companyIdProp === 'string' && companyIdProp
      ? companyIdProp
      : useDashboard()?.companyId
  const [services, setServices] = useState<Service[]>([])
  const [professionalServices, setProfessionalServices] = useState<
    ProfessionalServices[]
  >([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchServices = async () => {
    setLoading(true)
    try {
      if (!companyId) return
      const response = await fetch(`${apiUrl}/services/${companyId}`, {
        method: 'GET'
      })
      const data = await response.json()
      setServices(data)
      console.log(data)
    } catch (error) {
      setError('Error al cargar servicios')
    } finally {
      setLoading(false)
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
      setServices((services) => [...services, data])
    } catch (error) {
      setError('Error adding services')
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
      const data = await res.json()
      console.log('service deleted:', data)

      setServices((prevService) =>
        prevService.filter((service) => service.id !== serviceId)
      )
    } catch (error) {
      setError('Error deleting service:')
    }
  }

  const fetchProfessionalServices = async () => {
    try {
      const res = await fetch(`${apiUrl}/services/assignments/${companyId}`)
      const data = await res.json()
      setProfessionalServices(data)
    } catch (err) {
      console.error('Error cargando relaciones servicio-profesional')
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
    } catch (error) {
      setError('Error toggling professional-service')
    }
  }

  useEffect(() => {
    fetchServices()
    fetchProfessionalServices()
  }, [companyId])

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
