'use client'

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useState
} from 'react'
import { useDashboard } from './dashboard-Context'
import { Schedule, ScheduleProfessional } from '@/types'
import { apiUrl } from '@/app/api/apiUrl'
import { CrudReducer } from '@/app/reducer/crudReducer'

type SchedulesContextProps = {
  addSchedule: (formData: {
    dayOfWeek: number
    startTime: string
    endTime: string
  }) => Promise<void>
  deleteSchedule: (id: string) => Promise<void>
  fetchSchedules: () => Promise<void>
  handleToggleProfessionalSchedule: (
    scheduleId: string,
    professionalId: string
  ) => Promise<void>
  loading: boolean
  error: string | null
  schedules: Schedule[]
  scheduleProfessionals: ScheduleProfessional[]
}

const ScheduleContext = createContext<SchedulesContextProps | undefined>(
  undefined
)

export const useSchedule = () => {
  const context = useContext(ScheduleContext)
  if (!context) throw new Error('useSchedule debe usarse dentro de un provider')
  return context
}

export const ScheduleProvider = ({
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
  const [state, dispatch] = useReducer(CrudReducer<Schedule>, {
    items: [],
    loading: false,
    error: null
  })
  const [scheduleProfessionals, setScheduleProfessionals] = useState<
    ScheduleProfessional[]
  >([])

  const fetchSchedules = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      if (!companyId) return
      const response = await fetch(`${apiUrl}/schedules/${companyId}`, {
        method: 'GET'
      })
      const data = await response.json()
      dispatch({ type: 'SET_ITEMS', payload: data })
    } catch {
      dispatch({
        type: 'SET_ERROR',
        payload: 'No se pudieron cargar los horarios'
      })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const addSchedule = async (formData: {
    dayOfWeek: number
    startTime: string
    endTime: string
  }) => {
    try {
      const res = await fetch(`${apiUrl}/schedules/weekly/${companyId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()

      dispatch({ type: 'ADD_ITEMS', payload: data })
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Error añadiendo horarios' })
    }
  }

  const deleteSchedule = async (scheduleId: string) => {
    try {
      const res = await fetch(`${apiUrl}/schedules/${scheduleId}`, {
        method: 'DELETE'
      })
      await res.json()
      dispatch({ type: 'REMOVE_ITEMS', payload: scheduleId })
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Error deleting schedule' })
    }
  }
  const fetchProfessionalSchedules = async () => {
    try {
      const res = await fetch(`${apiUrl}/schedules/assignments/${companyId}`)
      const data = await res.json()
      setScheduleProfessionals(data)
    } catch {
      console.error('Error cargando relaciones servicio-profesional')
    }
  }

  const handleToggleProfessionalSchedule = async (
    scheduleId: string,
    professionalId: string
  ) => {
    const alreadyAssigned = scheduleProfessionals.some(
      (sp) =>
        sp.scheduleId === scheduleId && sp.professionalId === professionalId
    )
    try {
      if (alreadyAssigned) {
        await fetch(`${apiUrl}/schedules/assignment`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ scheduleId, professionalId })
        })
        setScheduleProfessionals((prev) =>
          prev.filter(
            (sp) =>
              !(
                sp.scheduleId === scheduleId &&
                sp.professionalId === professionalId
              )
          )
        )
      } else {
        await fetch(`${apiUrl}/schedules/assignment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ scheduleId, professionalId })
        })
        setScheduleProfessionals((prev) => [
          ...prev,
          { scheduleId, professionalId }
        ])
      }
    } catch {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Error toggling professional-schedule'
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
    fetchSchedules()
    fetchProfessionalSchedules()
  }, [companyId])

  const { items: schedules, loading, error } = state

  return (
    <ScheduleContext.Provider
      value={{
        schedules,
        addSchedule,
        deleteSchedule,
        fetchSchedules,
        handleToggleProfessionalSchedule,
        scheduleProfessionals,
        loading,
        error
      }}
    >
      {children}
    </ScheduleContext.Provider>
  )
}
