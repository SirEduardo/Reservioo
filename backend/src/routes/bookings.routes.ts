import { Router } from "express";
import { createBooking, createBookingAuto, deleteBooking, fetchBookingData, getBooking, getBookingById } from "../controllers/bookings.controller";



const bookingsRouter = Router()

bookingsRouter.get("/book/:slug/data", fetchBookingData)
bookingsRouter.post("/bookings/:companyId", createBooking)
bookingsRouter.post("/bookings/auto", createBookingAuto)
bookingsRouter.get("/bookings/id/:bookingId", getBookingById)
bookingsRouter.get("/bookings/:companyId", getBooking)
bookingsRouter.delete("/bookings/:bookingId", deleteBooking)



export default bookingsRouter