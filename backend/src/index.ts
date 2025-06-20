import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes";
import businessRouter from "./routes/business.routes";
import businessServicesRouter from "./routes/businessServices.routes";
import professionalsRouter from "./routes/professionals.routes";
import bookingsRouter from "./routes/bookings.routes";
import schedulesRouter from "./routes/schedules.routes";
import availabilityRouter from "./routes/availability.routes";
import rateLimit from "express-rate-limit";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3100;

// Configuración de CORS más permisiva para desarrollo
app.use(cors({
  origin: true, // Permitir todos los orígenes en desarrollo
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}))

// Configuración de helmet más permisiva para desarrollo
app.use(helmet({
  contentSecurityPolicy: false, // Deshabilitar CSP para desarrollo
  crossOriginEmbedderPolicy: false
}))

app.use(morgan("dev"))
app.use(express.json())

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    error: 'Demasiadas solicitudes desde esta IP. Por favor intenta más tarde'
  }
})

app.use(limiter)

app.use("/api/auth", authRouter)    
app.use("/api", businessRouter)
app.use("/api", businessServicesRouter)
app.use("/api", professionalsRouter)
app.use("/api", bookingsRouter)
app.use("/api", schedulesRouter)
app.use("/api/availability", availabilityRouter)

app.listen(PORT)