import { PrismaClient } from '@prisma/client'
import { Controller } from '../types'

const prisma = new PrismaClient()

// Obtener días disponibles
export const getAvailableDays: Controller = async (req, res) => {
  try {
    const { professionalId } = req.params
    const today = new Date()
    const next30Days = new Date()
    next30Days.setDate(today.getDate() + 30)

    // Generar fechas para los próximos 30 días
    const availableDates: string[] = []
    const currentDate = new Date(today)

    while (currentDate <= next30Days) {
      // Solo incluir días de lunes a viernes (1-5)
      if (currentDate.getDay() >= 1 && currentDate.getDay() <= 5) {
        availableDates.push(currentDate.toISOString().split('T')[0])
      }
      currentDate.setDate(currentDate.getDate() + 1)
    }

    res.json(availableDates)
  } catch (error) {
    console.error('Error getting available days:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Obtener horarios disponibles
export const getAvailableHours: Controller = async (req, res) => {
  try {
    const { date } = req.query

    if (!date) {
      return res.status(400).json({ error: 'Date parameter is required' })
    }

    // Horarios de trabajo: 9:00 AM a 6:00 PM
    const availableHours = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
      '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
      '18:00', '18:30', '19:00', '19:30', '20:00'
    ]

    res.json(availableHours)
  } catch (error) {
    console.error('Error getting available hours:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Obtener profesionales disponibles
export const getAvailableProfessionals: Controller = async (req, res) => {
  try {
    const { date, time } = req.query

    if (!date || !time) {
      return res.status(400).json({ error: 'Date and time parameters are required' })
    }

    const professionals = await prisma.professional.findMany({
      take: 5 // Limitar a 5 profesionales para simular disponibilidad
    })

    res.json(professionals)
  } catch (error) {
    console.error('Error getting available professionals:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
} 