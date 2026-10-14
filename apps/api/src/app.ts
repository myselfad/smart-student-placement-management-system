import express from "express";
import cors from "cors";
import "express-async-errors";
import { errorHandler } from "./middleware/errorHandler";
import rateLimit from "express-rate-limit";
import path from "path";
import prisma from "./lib/prisma";

const app = express();

// ─── CORS ───────────────────────────────────────────────────────────────────
// CRIT-3 fix: never combine credentials:true with wildcard origin.
// If FRONTEND_URL is not set, allow localhost only (safe default).
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL, "http://localhost:5173", "http://localhost:5174"]
  : ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, mobile, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

// ─── RATE LIMITING ──────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // tight limit for auth endpoints
  message: { error: { code: "RATE_LIMIT", message: "Too many requests, please try again later" } },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { error: { code: "RATE_LIMIT", message: "Too many requests from this IP, please try again later" } },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── ROUTES ─────────────────────────────────────────────────────────────────
import authRoutes from "./modules/auth/auth.routes";
import studentsRoutes from "./modules/students/students.routes";
import companiesRoutes from "./modules/companies/companies.routes";
import drivesRoutes from "./modules/drives/drives.routes";
import applicationsRoutes from "./modules/applications/applications.routes";
import notificationsRoutes from "./modules/notifications/notifications.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import announcementsRoutes from "./modules/announcements/announcements.routes";
import eligibilityRoutes from "./modules/eligibility/eligibility.routes";

const apiRouter = express.Router();

// MED-1: Health check with DB connectivity
apiRouter.get("/health", async (_req, res) => {
  const health: Record<string, unknown> = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };
  try {
    await prisma.$queryRaw`SELECT 1`;
    health.db = "ok";
  } catch {
    health.db = "error";
    health.status = "degraded";
    return res.status(503).json(health);
  }
  res.json(health);
});

apiRouter.use("/auth", authLimiter, authRoutes);
apiRouter.use("/students", studentsRoutes);
apiRouter.use("/companies", companiesRoutes);
apiRouter.use("/drives", drivesRoutes);
apiRouter.use("/applications", applicationsRoutes);
apiRouter.use("/notifications", notificationsRoutes);
apiRouter.use("/dashboard", dashboardRoutes);
apiRouter.use("/announcements", announcementsRoutes);
apiRouter.use("/eligibility", eligibilityRoutes);

app.use("/api", apiLimiter, apiRouter);

// Serve uploads statically for local dev only
if (process.env.NODE_ENV !== "production") {
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
}

// ─── GLOBAL ERROR HANDLER ───────────────────────────────────────────────────
app.use(errorHandler);

export default app;
