import { loginAdmin, registerAdmin } from "../models/auth.models";
import { Controller } from "../types";
import { generateToken } from "../utils/token";


export const register: Controller = async (req, res) => {
    const { ownerName, email, password, phone, businessName, businessType } = req.body

    if (!ownerName || !email || !password || !phone || !businessName || !businessType) {
        return res.status(400).json({ message: "Missing required fields" })
    }
    
    try {
        const admin = await registerAdmin({ ownerName, email, password, phone, businessName, businessType })
        const token = generateToken({id: admin.id})
        const { password: _, ...adminWithoutPassword } = admin
        res.status(201).json({ message: "Admin registered successfully", admin: adminWithoutPassword, token })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

export const login: Controller = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: "Missing required fields" })
    }

    try {
        const { admin, token } = await loginAdmin({ email, password })
        const { password: _, ...adminWithoutPassword } = admin
        res.status(200).json({ message: "Admin logged in successfully", admin: adminWithoutPassword, token })
    } catch (error) {
        if (error instanceof Error && (error.message === "Admin not found" || error.message === "Invalid password")) {
            return res.status(401).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal server error", error })
    }
}