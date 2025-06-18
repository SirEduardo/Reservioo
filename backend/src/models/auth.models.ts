import prisma from "../lib/prisma"
import bcrypt from "bcryptjs"
import { generateToken } from "../utils/token";

const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')          // reemplaza espacios por guiones
      .replace(/[^\w\-]+/g, '')      // elimina caracteres no alfanuméricos
      .replace(/\-\-+/g, '-')        // elimina guiones duplicados
      .replace(/^-+|-+$/g, '');      // elimina guiones al inicio o final
  }
  
export const registerAdmin = async ({ ownerName, email, password, phone, businessName, businessType }: { ownerName: string, email: string, password: string, phone: string, businessName: string, businessType: string }) => {

    const slug = generateSlug(businessName)
    const hashedPassword = await bcrypt.hash(password, 10)
    const admin = await prisma.company.create({
        data: {
            ownerName,
            email,
            password: hashedPassword,
            phone,
            businessName,
            businessType,
            slug
        }
    })
    return admin
}

export const loginAdmin = async ({ email, password }: { email: string, password: string  }) => {
    const admin = await prisma.company.findUnique({
        where: 
        { email }
    })

    if (!admin) {
        throw new Error("Admin not found")
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password)
    const token = generateToken({id: admin.id})

    if (!isPasswordValid) {
        throw new Error("Invalid password")
    }

    return { admin, token }
}