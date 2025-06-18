import prisma from "../lib/prisma";
import { getAvailableProfessionals, getProfessionalsBySchedule, getSchedulesByProfessional, getSchedules, assignProfessionalsToSchedules, unassingProfessionalFromSchedules, fetchProfessionalSchedules, createSchedules, deleteSchedules } from "../models/schedules.models";
import { Controller } from "../types";
import { calculateSlots } from "../utils/calculateSlots";


export const createWeekly: Controller = async (req, res) => {
    try {
      const { companyId } = req.params;
      const { dayOfWeek, startTime, endTime } = req.body;
  
      const created = await createSchedules(companyId, dayOfWeek, startTime, endTime);
      res.status(201).json(created);
    } catch (error) {
      res.status(500).json({ message: "Error creating weekly schedules", error });
    }
  };
  export const getSchedule: Controller = async (req, res) => {
    const { companyId } = req.params
    try {
      const schedules = await getSchedules(companyId)
      res.status(200).json(schedules)
    } catch (error) {
      console.error('Error in getSchedules:', error);
      res.status(500).json({ message: 'Error fetching schedules', error: String(error) });
    }
  }
  
  export const assignProfessionalToSchedule: Controller = async (req, res) => {
    const { scheduleId, professionalId } = req.body
  
    if (!scheduleId || !professionalId) {
      return res.status(400).json({ error: "Missing serviceId or professionalId" })
    }
  
    try {
      const assignment = await assignProfessionalsToSchedules(scheduleId, professionalId)
      res.status(201).json(assignment)
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Error assigning professional" })
    }
  }
  
  export const unassingProfessionalFromSchedule: Controller = async (req, res) => {
    const { scheduleId, professionalId } = req.body
  
    if (!scheduleId || !professionalId) {
      return res.status(400).json({ error: "Missing serviceId or professionalId" })
    }
  
    try {
      const result = await unassingProfessionalFromSchedules(scheduleId, professionalId)
      res.status(200).json(result)
    } catch (error) {
      res.status(500).json({ error: "Error unassigning professional" })
    }
  }
  export const fetchProfessionalSchedule: Controller = async (req, res) => {
    const { companyId } = req.params
  
    try {
      const assignment = await fetchProfessionalSchedules(companyId)
      return res.status(200).json(assignment)
    } catch (error) {
      return res.status(500).json({ message: 'Error al obtener relaciones' })
    }
  }


  
export const getSchedulesForProfessional: Controller = async (req, res) => {
    try {
      const { professionalId } = req.params;
      const schedules = await getSchedulesByProfessional(professionalId);
      res.status(200).json(schedules);
    } catch (error) {
      res.status(500).json({ message: "Error fetching schedules"});
    }
  };
  
  export const getProfessionalsForSchedule: Controller = async (req, res) => {
    try {
      const { scheduleId } = req.params;
      const professionals = await getProfessionalsBySchedule(scheduleId);
      res.status(200).json(professionals);
    } catch (error) {
      res.status(500).json({ message: "Error fetching professionals"});
    }
  };

export const getAvailableDays: Controller = async (req, res) => {
    const { professionalId } = req.params;
    const range = parseInt(req.query.range as string) || 30;
  
    try {
      console.log('getAvailableDays llamado con:', { professionalId, range });
      
      let schedules;
      
      if (professionalId) {
        // Buscar horarios para un profesional específico
        console.log('Buscando horarios para profesional específico:', professionalId);
        schedules = await prisma.schedule.findMany({
          where: {
            professionals: {
              some: {
                professionalId
              }
            }
          }
        });
      } else {
        // Buscar horarios para cualquier profesional
        console.log('Buscando horarios para cualquier profesional');
        schedules = await prisma.schedule.findMany({
          where: {
            professionals: {
              some: {}
            }
          }
        });
      }
      
      console.log('Horarios encontrados:', schedules);
      
      if (schedules.length === 0) {
        console.log('No se encontraron horarios configurados');
        return res.json([]);
      }
      
      const availableDates: string[] = [];
      const today = new Date();
  
      // Generar los próximos 30 días
      for (let i = 0; i < range; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dayOfWeek = date.getDay(); // 0 = Domingo, 1 = Lunes, etc.
  
        // Verificar si hay un horario configurado para este día
        const matchingSchedule = schedules.find((s: any) => s.dayOfWeek === dayOfWeek);
        if (!matchingSchedule) {
          console.log(`No hay horario configurado para el día ${dayOfWeek} (${date.toDateString()})`);
          continue;
        }
  
        console.log(`Día ${dayOfWeek} (${date.toDateString()}) tiene horario: ${matchingSchedule.startTime} - ${matchingSchedule.endTime}`);
        
        // Verificar reservas existentes para este día
        let bookings;
        if (professionalId) {
          bookings = await prisma.booking.findMany({
            where: {
              professionalId,
              date: {
                gte: new Date(date.setHours(0, 0, 0, 0)),
                lt: new Date(date.setHours(23, 59, 59, 999))
              }
            }
          });
        } else {
          bookings = await prisma.booking.findMany({
            where: {
              date: {
                gte: new Date(date.setHours(0, 0, 0, 0)),
                lt: new Date(date.setHours(23, 59, 59, 999))
              }
            }
          });
        }
  
        // Calcular slots disponibles
        const totalSlots = calculateSlots(matchingSchedule.startTime, matchingSchedule.endTime, 30);
        console.log(`Slots totales para ${date.toDateString()}: ${totalSlots.length}, Reservas: ${bookings.length}`);
        
        // Si hay menos reservas que slots totales, el día está disponible
        if (bookings.length < totalSlots.length) {
          availableDates.push(date.toISOString().split("T")[0]);
        }
      }
  
      console.log('Fechas disponibles encontradas:', availableDates);
      res.json(availableDates);
    } catch (error) {
      console.error('Error en getAvailableDays:', error);
      res.status(500).json({ message: "Error", error: String(error) });
    }
  };

  export const getAvailableHours: Controller = async (req, res) => {
    const { professionalId } = req.params;
    const { date } = req.query;
  
    try {
      console.log('getAvailableHours llamado con:', { professionalId, date });
      
      const parsedDate = new Date(date as string);
      const dayOfWeek = parsedDate.getDay();
      console.log('Día de la semana:', dayOfWeek, 'Fecha:', parsedDate.toDateString());
  
      let schedule;
      if (professionalId) {
        // Buscar horario para un profesional específico
        console.log('Buscando horario para profesional específico:', professionalId);
        schedule = await prisma.schedule.findFirst({
          where: {
            dayOfWeek,
            professionals: {
              some: {
                professionalId
              }
            }
          }
        });
      } else {
        // Buscar horarios para cualquier profesional en ese día
        console.log('Buscando horario para cualquier profesional en día:', dayOfWeek);
        schedule = await prisma.schedule.findFirst({
          where: {
            dayOfWeek,
            professionals: {
              some: {}
            }
          }
        });
      }
  
      console.log('Horario encontrado:', schedule);
      
      if (!schedule) {
        console.log('No se encontró horario para el día:', dayOfWeek);
        return res.status(404).json({ message: "No trabaja ese día" });
      }
  
      let bookings;
      if (professionalId) {
        // Buscar reservas del profesional específico
        console.log('Buscando reservas para profesional específico:', professionalId);
        bookings = await prisma.booking.findMany({
          where: {
            professionalId,
            date: {
              gte: new Date(`${date}T00:00:00.000Z`),
              lt: new Date(`${date}T23:59:59.999Z`)
            }
          }
        });
      } else {
        // Buscar todas las reservas para ese día
        console.log('Buscando todas las reservas para el día:', date);
        bookings = await prisma.booking.findMany({
          where: {
            date: {
              gte: new Date(`${date}T00:00:00.000Z`),
              lt: new Date(`${date}T23:59:59.999Z`)
            }
          }
        });
      }
  
      console.log('Reservas encontradas:', bookings.length);
      
      const bookedTimes = bookings.map((b: any) => new Date(b.date).toTimeString().slice(0, 5));
      console.log('Horarios reservados:', bookedTimes);
  
      const slots = calculateSlots(schedule.startTime, schedule.endTime, 30);
      console.log('Todos los slots disponibles:', slots);
      
      const available = slots.filter(t => !bookedTimes.includes(t));
      console.log('Slots disponibles después de filtrar reservas:', available);
  
      res.json(available);
    } catch (error) {
      console.error('Error en getAvailableHours:', error);
      res.status(500).json({ message: "Error", error });
    }
  };
  export const getAvailableProfessional: Controller = async (req, res) => {
    try {
      console.log('Entró a getAvailableProfessional');
      const { date, time } = req.query as { date: string; time: string };
      console.log('Parámetros recibidos:', date, time);
  
      const professionals = await getAvailableProfessionals(date, time);
      res.json(professionals);
    } catch (error) {
      console.error('Error in getAvailableProfessional:', error);
      res.status(500).json({ message: 'Error fetching professionals', error: String(error) });
    }
  };
  
  export const deleteSchedule: Controller = async (req, res) => {
    const { scheduleId } = req.params
    try {
      const schedule = await deleteSchedules(scheduleId)
      return res.status(200).json(schedule)
    } catch (error) {
      res.status(500).json({ message: "Error deleting schedule"});
    }
  }

