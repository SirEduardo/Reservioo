'use client'

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'
import { useDashboard } from './dashboard-Context'
import { Schedule, ScheduleProfessional } from '@/types'

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

export const ScheduleProvider = ({ children }: { children: ReactNode }) => {
  const { companyId } = useDashboard()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [scheduleProfessionals, setScheduleProfessionals] = useState<
    ScheduleProfessional[]
  >([])

  const fetchSchedules = async () => {
    setLoading(true)
    try {
      if (!companyId) return
      const response = await fetch(
        `http://localhost:3100/api/schedules/${companyId}`,
        {
          method: 'GET'
        }
      )
      const data = await response.json()
      setSchedules(data)
      console.log(data)
    } catch (error) {
      setError('No se pudieron cargar los horarios')
    } finally {
      setLoading(false)
    }
  }

  const addSchedule = async (formData: {
    dayOfWeek: number
    startTime: string
    endTime: string
  }) => {
    try {
      const res = await fetch(
        `http://localhost:3100/api/schedules/weekly/${companyId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      )
      const data = await res.json()
      console.log(data)

      setSchedules((schedules) => [...schedules, data])
    } catch (error) {
      setError('Error añadiendo horarios')
    }
  }

  const deleteSchedule = async (scheduleId: string) => {
    try {
      const res = await fetch(
        `http://localhost:3100/api/schedules/${scheduleId}`,
        {
          method: 'DELETE'
        }
      )
      const data = await res.json()
      console.log('Schedule deleted', data)

      setSchedules((prevSchedules) =>
        prevSchedules.filter((schedule) => schedule.id !== scheduleId)
      )
    } catch (error) {
      setError('Error deleting schedule')
    }
  }
  const fetchProfessionalSchedules = async () => {
    try {
      const res = await fetch(
        `http://localhost:3100/api/schedules/assignments/${companyId}`
      )
      const data = await res.json()
      setScheduleProfessionals(data)
    } catch (err) {
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
        await fetch(`http://localhost:3100/api/schedules/assignment`, {
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
        await fetch(`http://localhost:3100/api/schedules/assignment`, {
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
    } catch (error) {
      setError('Error toggling professional-schedule')
    }
  }

  useEffect(() => {
    fetchSchedules()
    fetchProfessionalSchedules()
  }, [companyId])

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
