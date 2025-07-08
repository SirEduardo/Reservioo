import prisma from "../lib/prisma"
import { addBusinessClosure, deleteBusinessClosure, getBusinessConfig, updateBusinessSlug } from "../models/business.models"
import { Controller } from "../types"



export const getBusiness: Controller = async (req, res) => {
    try {
        const { id } = req.params
        const business = await getBusinessConfig(id)
        if (!business) throw new Error('Business not found')
        res.status(200).json(business)
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

export const updateSlug: Controller = async (req, res) => {
    try {
        const { id } = req.params
        const { slug } = req.body
        if (!slug) return res.status(400).json({ message: "Slug requerido" })
        try {
            const updated = await updateBusinessSlug(id, slug)
            res.status(200).json(updated)
        } catch (err: any) {
            if (err.message && err.message.includes('ya está en uso')) {
                return res.status(409).json({ message: err.message })
            }
            throw err
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

// Endpoint público para obtener companyId por slug
export const getCompanyIdBySlug: Controller = async (req, res) => {
    const { slug } = req.params;
    const company = await prisma.company.findUnique({ where: { slug } });
    if (!company) return res.status(404).json({ message: "Empresa no encontrada" });
    res.json({ companyId: company.id, businessName: company.businessName });
};

export const addClosure: Controller = async (req, res) => {
    try {
        const { companyId } = req.params
        const { startDate, endDate, reason } = req.body
        if (!startDate || !endDate || !reason) throw new Error('Campos requeridos')
        
        const selectedStartDate = new Date(startDate)
        const selectedEndDate = new Date(endDate)

        selectedStartDate.setHours(0, 0, 0, 0)
        selectedEndDate.setHours(23, 59, 59, 999)

        const newClosure = await addBusinessClosure(companyId, selectedStartDate, selectedEndDate, reason)
        return res.status(201).json(newClosure)
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error })
    }
}

export const deleteClosure: Controller = async (req, res) => {
    try {
        const { closureId } = req.params
        const closure = await deleteBusinessClosure(closureId)
        return res.status(200).json(closure)
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error })
    }
}

