import { Professional, ProfessionalServices, ScheduleProfessional } from "@prisma/client";
import prisma from "../lib/prisma";
import { createBookings, deleteBookings, getBookingDataBySlug, getBookings, getBookingsById } from "../models/bookings.models";
import { getAvailableProfessionals } from "../models/schedules.models";
import { Controller } from "../types";


export const fetchBookingData: Controller = async (req, res) => {
  const { slug } = req.params

  try {
    const company = await getBookingDataBySlug(slug)

    const services = company.services
    const professionals = company?.professionals.map((prof:any) => ({
      id: prof.id,
      name: prof.name,
      services: prof.professionalServices.map((ps:any) => ({
        id: ps.service.id,
        name: ps.service.name,
        duration: ps.service.duration,
        price: ps.service.price,
      })),
      schedule: prof.schedules.map((s:any) => ({
        dayOfWeek: s.schedule.dayOfWeek,
        startTime: s.schedule.startTime,
        endTime: s.schedule.endTime,
      })),
    }));
    
    

    const response = {
      company: {
        id: company.id,
        name: company.businessName,
        type: company.businessType,
      },
      settings: company.settings,
      services,
      professionals,
    }

    res.json(response)
  } catch (error) {
    res.status(500).json({ 
      message: "Internal server error",
      error: error instanceof Error ? error.message : String(error)
    })
  }
}

export const createBooking: Controller = async (req, res) => {
    try {
        const { companyId } = req.params
        const { professionalId, serviceId, name, email, phone, date } = req.body
        if (!professionalId || !serviceId || !name || !email || !phone || !date) {
          return res.status(400).json({ message: "Faltan campos obligatorios" })
        }
        
        const booking = await createBookings(companyId, professionalId, serviceId, name, email, phone, date)
        res.status(201).json(booking)
    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor", error: error instanceof Error ? error.message : error })   
    }
}

export const createBookingAuto: Controller = async (req, res) => {
    const { companyId, serviceId, name, email, phone, date } = req.body;
    if (!companyId || !serviceId || !name || !email || !phone || !date) {
      return res.status(400).json({ message: "Faltan campos obligatorios" })
    }
    
    const dateObj = new Date(date);
    const time = dateObj.toTimeString().slice(0, 5);
    const formattedDate = dateObj.toISOString().split("T")[0];
  
    const professionals = await getAvailableProfessionals(formattedDate, time);
  
    if (professionals.length === 0) {
      return res.status(400).json({ message: "No hay profesionales disponibles" });
    }
  
    const assignedProfessionalId = professionals[0]; // elige el primero, o puedes randomizar
  
    const booking = await prisma.booking.create({
      data: {
        companyId,
        professionalId: assignedProfessionalId,
        serviceId,
        name,
        email,
        phone,
        date: dateObj
      }
    });
  
    res.status(201).json(booking);
  };
  
export const getBooking: Controller = async (req, res) => {
    try {
        const { companyId } = req.params
        const bookings = await getBookings(companyId)
        if (!bookings) {
          return res.status(404).json({ message: "No hay reservas" })
        }
        res.status(200).json(bookings)
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error })
    }
}
export const getBookingById: Controller = async (req, res) => {
    try {
        const { bookingId } = req.params
        const booking = await getBookingsById(bookingId)
        if (!booking) {
          return res.status(404).json({ message: "Reserva no encontrada" })
        }
        res.status(200).json(booking)
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error })
    }
}
export const deleteBooking: Controller = async (req, res) => {
    try {
        const { bookingId } = req.params
        const booking = await deleteBookings(bookingId)
        if (!booking) {
          return res.status(404).json({ message: "Reserva no encontrada" })
        }
        res.status(200).json(booking)
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error })
    }
}
