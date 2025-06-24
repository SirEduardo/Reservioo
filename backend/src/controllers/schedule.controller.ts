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
    const { serviceId, month, year } = req.query;

    // Validar mes y año
    const monthNum = month ? parseInt(month as string) : null;
    const yearNum = year ? parseInt(year as string) : null;
    if (monthNum === null || yearNum === null || isNaN(monthNum) || isNaN(yearNum)) {
      return res.status(400).json({ message: "Se requiere month y year como query params" });
    }

    try {
      let schedules;
      if (professionalId) {
        // Buscar horarios para un profesional específico
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
        schedules = await prisma.schedule.findMany({
          where: {
            professionals: {
              some: {}
            }
          },
          include: {
            professionals: true
          }
        });
      }
      if (!schedules || schedules.length === 0) {
        return res.json([]);
      }

      // Obtener duración del servicio si se pasa serviceId
      let minDuration = 30;
      if (serviceId) {
        const service = await prisma.service.findUnique({ where: { id: serviceId as string } });
        if (service) {
          minDuration = service.duration;
        }
      }

      const availableDates: string[] = [];
      // Calcular primer y último día del mes
      const firstDay = new Date(yearNum, monthNum - 1, 1);
      const lastDay = new Date(yearNum, monthNum, 0); // último día del mes
      for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
        const date = new Date(d);
        const dayOfWeek = date.getDay();
        // Tramos para ese día
        const daySchedules = schedules.filter((s: any) => s.dayOfWeek === dayOfWeek);
        if (!daySchedules || daySchedules.length === 0) continue;

        // Buscar reservas para ese día
        let bookings;
        if (professionalId) {
          bookings = await prisma.booking.findMany({
            where: {
              professionalId,
              date: {
                gte: new Date(date.setHours(0, 0, 0, 0)),
                lt: new Date(date.setHours(23, 59, 59, 999))
              }
            },
            include: { service: true }
          });
        } else {
          bookings = await prisma.booking.findMany({
            where: {
              date: {
                gte: new Date(date.setHours(0, 0, 0, 0)),
                lt: new Date(date.setHours(23, 59, 59, 999))
              }
            },
            include: { service: true }
          });
        }

        // Calcular todos los slots posibles de todos los tramos
        let slots: string[] = [];
        for (const schedule of daySchedules) {
          slots = slots.concat(calculateSlots(schedule.startTime, schedule.endTime, 30));
        }
        slots = slots.sort();

        // Marcar slots ocupados por duración
        const occupiedSlots = new Set();
        for (const booking of bookings) {
          const bookingStart = new Date(booking.date);
          const duration = booking.service?.duration || 30;
          const bookingEnd = new Date(bookingStart.getTime() + duration * 60000);
          for (const slot of slots) {
            const [h, m] = slot.split(":").map(Number);
            const slotDate = new Date(
              bookingStart.getFullYear(),
              bookingStart.getMonth(),
              bookingStart.getDate(),
              h,
              m,
              0,
              0
            );
            if (slotDate >= bookingStart && slotDate < bookingEnd) {
              occupiedSlots.add(slot);
            }
          }
        }

        // Filtrar slots realmente disponibles para la duración requerida
        const hasAvailableSlot = slots.some(slot => {
          const [h, m] = slot.split(":").map(Number);
          const slotStart = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            h,
            m,
            0,
            0
          );
          const slotEnd = new Date(slotStart.getTime() + minDuration * 60000);
          // ¿Hay algún slot dentro de este rango que esté ocupado?
          for (const s of slots) {
            const [sh, sm] = s.split(":").map(Number);
            const sDate = new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
              sh,
              sm,
              0,
              0
            );
            if (sDate >= slotStart && sDate < slotEnd && occupiedSlots.has(s)) {
              return false;
            }
          }
          // Además, ¿el slotEnd está dentro de algún tramo horario?
          let slotEndIsInSchedule = false;
          for (const schedule of daySchedules) {
            const [endH, endM] = schedule.endTime.split(":").map(Number);
            const scheduleEnd = new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
              endH,
              endM,
              0,
              0
            );
            const [startH, startM] = schedule.startTime.split(":").map(Number);
            const scheduleStart = new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
              startH,
              startM,
              0,
              0
            );
            if (slotStart >= scheduleStart && slotEnd <= scheduleEnd) {
              slotEndIsInSchedule = true;
              break;
            }
          }
          return slotEndIsInSchedule;
        });

        if (hasAvailableSlot) {
          availableDates.push(date.toISOString().split("T")[0]);
        }
      }

      const uniqueDates = [...new Set(availableDates)];
      res.json(uniqueDates);
    } catch (error) {
      res.status(500).json({ message: "Error", error: String(error) });
    }
  };

  export const getAvailableHours: Controller = async (req, res) => {
    const { professionalId } = req.params;
    const { date, serviceId } = req.query;
  
    try {
      const parsedDate = new Date(date as string);
      const dayOfWeek = parsedDate.getDay();
  
      let schedules;
      if (professionalId) {
        // Buscar todos los tramos horarios para un profesional específico
        schedules = await prisma.schedule.findMany({
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
        // Buscar todos los tramos horarios para cualquier profesional en ese día
        schedules = await prisma.schedule.findMany({
          where: {
            dayOfWeek,
            professionals: {
              some: {}
            }
          },
          include: {
            professionals: true
          }
        });
      }
  
      if (!schedules || schedules.length === 0) {
        return res.status(404).json({ message: "No trabaja ese día" });
      }
  
      let bookings;
      if (professionalId) {
        // Buscar reservas del profesional específico
        bookings = await prisma.booking.findMany({
          where: {
            professionalId,
            date: {
              gte: new Date(`${date}T00:00:00.000Z`),
              lt: new Date(`${date}T23:59:59.999Z`)
            }
          },
          include: {
            service: true
          }
        });
      } else {
        // Buscar todas las reservas para ese día
        bookings = await prisma.booking.findMany({
          where: {
            date: {
              gte: new Date(`${date}T00:00:00.000Z`),
              lt: new Date(`${date}T23:59:59.999Z`)
            }
          },
          include: {
            service: true
          }
        });
      }
  
      // Calcular todos los slots posibles de todos los tramos
      let slots: string[] = [];
      for (const schedule of schedules) {
        slots = slots.concat(calculateSlots(schedule.startTime, schedule.endTime, 30));
      }
      // Ordenar los slots por hora
      slots = slots.sort();

      // Crear un set de slots ocupados por duración
      const occupiedSlots = new Set();
      for (const booking of bookings) {
        const bookingStart = new Date(booking.date);
        const duration = booking.service?.duration || 30; // fallback 30 min
        const bookingEnd = new Date(bookingStart.getTime() + duration * 60000);
        // Marcar todos los slots que caen dentro del rango ocupado
        for (const slot of slots) {
          // slot: '09:00' -> convertir a Date en UTC en el mismo día
          const [h, m] = slot.split(":").map(Number);
          const slotDate = new Date(
            bookingStart.getFullYear(),
            bookingStart.getMonth(),
            bookingStart.getDate(),
            h,
            m,
            0,
            0
          );
          if (slotDate >= bookingStart && slotDate < bookingEnd) {
            occupiedSlots.add(slot);
          }
        }
      }

      // Si se está consultando para un servicio específico, bloquear también los slots que no permitan completar la duración
      let minDuration = 30;
      if (serviceId) {
        // Buscar la duración del servicio
        const service = await prisma.service.findUnique({ where: { id: serviceId as string } });
        if (service) {
          minDuration = service.duration;
        }
      }

      let available: string[] = [];

      if (!professionalId) {
        const slotAvailability: Record<string, number> = {};
        for (const schedule of schedules) {
          const tramoSlots = calculateSlots(schedule.startTime, schedule.endTime, 30, 'Europe/Madrid', parsedDate);
          for (const slot of tramoSlots) {
            for (const sp of (schedule as any).professionals) {
              const [h, m] = slot.split(":").map(Number);
              const slotDate = new Date(
                parsedDate.getFullYear(),
                parsedDate.getMonth(),
                parsedDate.getDate(),
                h,
                m,
                0,
                0
              );
              const existingBooking = bookings.find(
                b => b.professionalId === sp.professionalId && new Date(b.date).getTime() === slotDate.getTime()
              );
              if (!existingBooking) {
                slotAvailability[slot] = (slotAvailability[slot] || 0) + 1;
              }
            }
          }
        }
        available = Object.entries(slotAvailability)
          .filter(([slot, count]) => count > 0)
          .map(([slot]) => slot)
          .sort();
      } else {
        // Lógica original para un profesional específico
        for (const schedule of schedules) {
          const tramoSlots = calculateSlots(schedule.startTime, schedule.endTime, 30, 'Europe/Madrid', parsedDate);
          const tramoAvailable = tramoSlots.filter(slot => {
            const [h, m] = slot.split(":").map(Number);
            const slotStart = new Date(
              parsedDate.getFullYear(),
              parsedDate.getMonth(),
              parsedDate.getDate(),
              h,
              m,
              0,
              0
            );
            const slotEnd = new Date(slotStart.getTime() + minDuration * 60000);
            for (const s of tramoSlots) {
              const [sh, sm] = s.split(":").map(Number);
              const sDate = new Date(
                parsedDate.getFullYear(),
                parsedDate.getMonth(),
                parsedDate.getDate(),
                sh,
                sm,
                0,
                0
              );
              if (sDate >= slotStart && sDate < slotEnd && occupiedSlots.has(s)) {
                return false;
              }
            }
            const [endH, endM] = schedule.endTime.split(":").map(Number);
            const scheduleEnd = new Date(
              parsedDate.getFullYear(),
              parsedDate.getMonth(),
              parsedDate.getDate(),
              endH,
              endM,
              0,
              0
            );
            const [startH, startM] = schedule.startTime.split(":").map(Number);
            const scheduleStart = new Date(
              parsedDate.getFullYear(),
              parsedDate.getMonth(),
              parsedDate.getDate(),
              startH,
              startM,
              0,
              0
            );
            return slotStart >= scheduleStart && slotEnd <= scheduleEnd;
          });
          available = available.concat(tramoAvailable);
        }
      }

      const uniqueSlots = [...new Set(available)].sort();
      res.json(uniqueSlots);
    } catch (error) {
      res.status(500).json({ message: "Error", error });
    }
  };
  export const getAvailableProfessional: Controller = async (req, res) => {
    try {
      const { date, time } = req.query as { date: string; time: string };
  
      const professionals = await getAvailableProfessionals(date, time);
      res.json(professionals);
    } catch (error) {
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

