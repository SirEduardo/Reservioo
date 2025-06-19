'use client'

import type React from 'react'
import { createContext, useContext } from 'react'
import type { Theme } from '../lib/themes'

// Tema único de Salud y Bienestar
const healthcareTheme: Theme = {
  id: 'healthcare',
  name: 'Salud y Bienestar',
  description: 'Ideal para clínicas, fisioterapeutas, dentistas',
  businessType: 'healthcare',
  colors: {
    primary: 'rgb(59, 130, 246)', // blue-500
    primaryHover: 'rgb(37, 99, 235)', // blue-600
    primaryLight: 'rgb(219, 234, 254)', // blue-100
    primaryDark: 'rgb(30, 64, 175)', // blue-800
    secondary: 'rgb(16, 185, 129)', // emerald-500
    accent: 'rgb(99, 102, 241)', // indigo-500
    background: 'rgb(249, 250, 251)', // gray-50
    surface: 'rgb(255, 255, 255)', // white
    border: 'rgb(229, 231, 235)', // gray-200
    text: 'rgb(17, 24, 39)', // gray-900
    textSecondary: 'rgb(107, 114, 128)', // gray-500
    success: 'rgb(34, 197, 94)', // green-500
    warning: 'rgb(245, 158, 11)', // amber-500
    error: 'rgb(239, 68, 68)' // red-500
  },
  gradients: {
    primary: 'linear-gradient(135deg, rgb(59, 130, 246), rgb(99, 102, 241))',
    secondary: 'linear-gradient(135deg, rgb(16, 185, 129), rgb(5, 150, 105))',
    background: '#fff' // Fondo blanco sólido para evitar fondo negro
  }
}

interface ThemeContextType {
  currentTheme: Theme
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Siempre devolvemos el tema de healthcare
  return (
    <ThemeContext.Provider
      value={{
        currentTheme: healthcareTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
