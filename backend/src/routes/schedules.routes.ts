import { Router } from "express";
import { assignProfessionalToSchedule, createWeekly, deleteSchedule, fetchProfessionalSchedule, getAvailableDays, getAvailableHours, getAvailableProfessional, getProfessionalsForSchedule, getSchedule, getSchedulesForProfessional, unassingProfessionalFromSchedule } from "../controllers/schedule.controller";



const schedulesRouter = Router()


schedulesRouter.post("/schedules/assignment", assignProfessionalToSchedule )
schedulesRouter.delete('/schedules/assignment', unassingProfessionalFromSchedule)
schedulesRouter.get('/schedules/assignments/:companyId', fetchProfessionalSchedule)
schedulesRouter.post("/schedules/weekly/:companyId", createWeekly)
schedulesRouter.get("/schedules/:companyId", getSchedule)
schedulesRouter.get("/professionals/:professionalId/schedules", getSchedulesForProfessional);
schedulesRouter.get("/schedules/:scheduleId/professionals", getProfessionalsForSchedule);
schedulesRouter.get("/schedules/availability/days/:professionalId", getAvailableDays)
schedulesRouter.get("/schedules/availability/hours/:professionalId", getAvailableHours)
schedulesRouter.get("/schedules/availability/professionals", getAvailableProfessional)
schedulesRouter.delete("/schedules/:scheduleId", deleteSchedule)


export default schedulesRouter