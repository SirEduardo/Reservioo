import { Router } from "express";
import { assignProfessionalToService, createService, deleteService, fetchProfessionalService, getService, unassingProfessionalFromService, updateService } from "../controllers/businessServices.controller";


const businessServicesRouter = Router()

businessServicesRouter.post("/services/assignment", assignProfessionalToService)
businessServicesRouter.delete("/services/assignment", unassingProfessionalFromService)
businessServicesRouter.get('/services/assignments/:companyId', fetchProfessionalService)
businessServicesRouter.post("/services/:companyId", createService)
businessServicesRouter.get("/services/:companyId", getService)
businessServicesRouter.patch("/services/:serviceId", updateService)
businessServicesRouter.delete("/services/:serviceId", deleteService)

export default businessServicesRouter