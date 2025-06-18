import { assignProfessionalsToServices, createServices, deleteServices, fetchProfessionalServices, getBusinessServices, unassingProfessionalFromServices, updateServices } from "../models/businessServices.models"
import { Controller } from "../types"


export const createService: Controller = async (req, res) => {
    try {
        const { companyId } = req.params
        const { name, duration, price } = req.body
        if (!name || !duration || !price) {
            return res.status(400).json({ message: "Faltan campos obligatorios" })
        }
        const service = await createServices(name, duration, price, companyId)
        res.status(201).json(service)   
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Error interno del servidor",
            error: error instanceof Error ? error.message : error
        })
    }
}

export const getService: Controller = async (req, res) => {
    try {
        const { companyId } = req.params
        const services = await getBusinessServices(companyId)
        if (!services) {
            return res.status(404).json({ message: "No hay servicios" })
        }
        res.status(200).json(services)
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Error interno del servidor",
            error: error instanceof Error ? error.message : error
        })
    }
}

export const updateService: Controller = async (req, res) => {
    try {
        const { serviceId } = req.params
        const { name, duration, price } = req.body
        if (!name || !duration || !price) {
            return res.status(400).json({ message: "Faltan campos obligatorios" })
        }
        const service = await updateServices(serviceId, name, duration, price)
        if (!service) {
            return res.status(404).json({ message: "Servicio no encontrado" })
        }
        res.status(200).json(service)
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Error interno del servidor",
            error: error instanceof Error ? error.message : error
        })
    }
}

export const deleteService: Controller = async  (req, res) => {
    try {   
        const { serviceId } = req.params
        const service = await deleteServices(serviceId)
        if (!service) {
            return res.status(404).json({ message: "Servicio no encontrado" })
        }
        res.status(200).json(service)
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Error interno del servidor",
            error: error instanceof Error ? error.message : error
        })
    }
}

export const assignProfessionalToService: Controller = async (req, res) => {
    const { serviceId, professionalId } = req.body
  
    if (!serviceId || !professionalId) {
      return res.status(400).json({ error: "Missing serviceId or professionalId" })
    }
  
    try {
      const assignment = await assignProfessionalsToServices(serviceId, professionalId)
      res.status(201).json(assignment)
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Error assigning professional" })
    }
  }
  
  export const unassingProfessionalFromService: Controller = async (req, res) => {
    const { serviceId, professionalId } = req.body
  
    if (!serviceId || !professionalId) {
      return res.status(400).json({ error: "Missing serviceId or professionalId" })
    }
  
    try {
      const result = await unassingProfessionalFromServices(serviceId, professionalId)
      res.status(200).json(result)
    } catch (error) {
      res.status(500).json({ error: "Error unassigning professional" })
    }
  }
  
  export const fetchProfessionalService: Controller = async (req, res) => {
    const { companyId } = req.params
  
    try {
      const assignment = await fetchProfessionalServices(companyId)
      return res.status(200).json(assignment)
    } catch (error) {
      return res.status(500).json({ message: 'Error al obtener relaciones' })
    }
  }
  