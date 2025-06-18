import { Router } from "express";
import { createProfessional, deleteProfessional, getProfessional, getProfessionalById } from "../controllers/professionals.controller";


const professionalsRouter = Router()

professionalsRouter.post("/professionals/:companyId", createProfessional)
professionalsRouter.get("/professionals/:companyId", getProfessional)
professionalsRouter.get("/professional/:professionalId", getProfessionalById)
professionalsRouter.delete("/professional/:professionalId", deleteProfessional)

export default professionalsRouter