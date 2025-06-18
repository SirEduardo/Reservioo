import jwt from "jsonwebtoken";

export const generateToken = (payload: { id: string }) => {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "30d" })
}

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET!)
    } catch (error) {
        throw new Error("Invalid token")
    }
}