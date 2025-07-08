import { Router } from "express"
import { getBusiness, updateSlug, getCompanyIdBySlug, addClosure, deleteClosure } from "../controllers/business.controller"



const businessRouter = Router()

businessRouter.patch("/business/:id/slug", updateSlug)
businessRouter.get("/business/:id", getBusiness)
businessRouter.get('/public/company-by-slug/:slug', getCompanyIdBySlug)
businessRouter.post('/business-closures/:companyId', addClosure)
businessRouter.delete('/business-closure/:closureId', deleteClosure)


export default businessRouter