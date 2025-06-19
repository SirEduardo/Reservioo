import { Router } from "express"
import { getBusiness, updateSlug, getCompanyIdBySlug } from "../controllers/business.controller"



const businessRouter = Router()

businessRouter.patch("/business/:id/slug", updateSlug)
businessRouter.get("/business/:id", getBusiness)
businessRouter.get('/public/company-by-slug/:slug', getCompanyIdBySlug)


export default businessRouter