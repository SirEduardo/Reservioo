import { Router } from "express"
import { getBusiness } from "../controllers/business.controller"



const businessRouter = Router()

businessRouter.get("/business/:id", getBusiness)


export default businessRouter