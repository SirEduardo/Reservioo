import { getBusinessConfig } from "../models/business.models"
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



