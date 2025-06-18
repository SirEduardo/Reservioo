'use client'

import { createContext, useContext, ReactNode, useState, useEffect } from "react"

type DashboardContextType = {
  companyId: string | null
  setCompanyId: (id: string | null) => void
  activeTab: string
  setActiveTab: (tab: string) => void
  isLoaded: boolean
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export const useDashboard = () => {
  const context = useContext(DashboardContext)
  if (!context) throw new Error("useDashboard must be used within a DashboardProvider")
  return context
}

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [companyId, setCompanyIdState] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("reservas")
  const [isLoaded, setIsLoaded] = useState(false)

  const setCompanyId = (id: string | null) => {
    if (id) {
      localStorage.setItem("companyId", id)
    } else {
      localStorage.removeItem("companyId")
    }
    setCompanyIdState(id)
  }

  useEffect(() => {
    const storedId = localStorage.getItem("companyId")
    if (storedId) {
      setCompanyIdState(storedId)
    }
    setIsLoaded(true)
  }, [])

  return (
    <DashboardContext.Provider value={{ companyId, setCompanyId, activeTab, setActiveTab, isLoaded }}>
      {children}
    </DashboardContext.Provider>
  )
}
