import { createProfessionals, deleteProfessionals, getProfessionals, getProfessionalsById } from "../models/professionals.models";
import { Controller } from "../types";


export const createProfessional: Controller = async (req, res) => {
    try {
        const { companyId } = req.params
        const { name } = req.body
        if (!name) {
            return res.status(400).json({ message: "Faltan campos obligatorios" })
        }
        const professional = await createProfessionals(name, companyId)
        res.status(201).json(professional)
    } catch (error:any) {
        console.error(error);
        return res.status(500).json({
            message: "Error interno del servidor",
            error: error instanceof Error ? error.message : error
        })
    }
}

export const getProfessional: Controller = async (req, res) => {
    try {
        const { companyId } = req.params
        const professionals = await getProfessionals(companyId)
        if (!professionals) {
            return res.status(404).json({ message: "No hay profesionales" })
        }
        res.status(200).json(professionals)
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Error interno del servidor",
            error: error instanceof Error ? error.message : error
        })
    }
}
export const getProfessionalById: Controller = async (req, res) => {
    try {
        const { professionalId } = req.params 
        if (!professionalId) {
            return res.status(400).json({ message: "Professional ID is required" })
        }
        const professional = await getProfessionalsById(professionalId)
        if (!professional) {
            return res.status(404).json({ message: "Profesional no encontrado" })
        }
        res.status(200).json(professional)
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Error interno del servidor",
            error: error instanceof Error ? error.message : error
        })
    }
}
export const deleteProfessional: Controller = async (req, res) => {
    try {
        const { professionalId } = req.params
        const professional = await deleteProfessionals(professionalId)
        if (!professional) {
            return res.status(404).json({ message: "Profesional no encontrado" })
        }
        return res.status(200).json(professional)
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Error interno del servidor",
            error: error instanceof Error ? error.message : error
        })
    }
} 