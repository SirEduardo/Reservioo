import { Router } from 'express'
import { getAvailableDays, getAvailableHours, getAvailableProfessional } from '../controllers/schedule.controller'

const router = Router()

// Obtener días disponibles para cualquier profesional
router.get('/days', getAvailableDays)

// Obtener días disponibles para un profesional específico
router.get('/days/:professionalId', getAvailableDays)

// Obtener horarios disponibles para cualquier profesional en una fecha
router.get('/hours', getAvailableHours)

// Obtener horarios disponibles para un profesional específico en una fecha
router.get('/hours/:professionalId', getAvailableHours)

// Obtener profesionales disponibles para una fecha y hora específica
router.get('/professionals', getAvailableProfessional)

export default router 