import express from "express";
import cors from "cors";
import "express-async-errors";
import { errorHandler } from "./middleware/errorHandler";
import rateLimit from "express-rate-limit";
import path from "path";
import prisma from "./lib/prisma";

const app = express();

// Trust reverse proxy (Render, Vercel, Cloudflare) so express-rate-limit
// and req.ip correctly read the X-Forwarded-For header without throwing errors.
app.set("trust proxy", 1);

// ─── CORS CONFIGURATION ─────────────────────────────────────────────────────
const getAllowedOrigins = (): string[] => {
  const defaults = ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"];
  if (!process.env.FRONTEND_URL) return defaults;
  const configured = process.env.FRONTEND_URL.split(",")
    .map((url) => url.trim().replace(/\/+$/, ""))
    .filter(Boolean);
  return Array.from(new Set([...defaults, ...configured]));
};

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, mobile apps, server-to-server)
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/+$/, "");
      const allowed = getAllowedOrigins();
      if (allowed.includes(cleanOrigin) || cleanOrigin.endsWith(".vercel.app")) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

// ─── RATE LIMITING ──────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 attempts per 15 minutes
  message: { error: { code: "RATE_LIMIT", message: "Too many attempts from this IP, please try again later" } },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { error: { code: "RATE_LIMIT", message: "Too many requests from this IP, please try again later" } },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── HEALTH CHECKS ──────────────────────────────────────────────────────────
const handleHealthCheck = async (_req: express.Request, res: express.Response) => {
  const health: Record<string, unknown> = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()),
  };
  try {
    await prisma.$queryRaw`SELECT 1`;
    health.db = "ok";
    return res.status(200).json(health);
  } catch {
    health.db = "error";
    health.status = "degraded";
    return res.status(503).json(health);
  }
};

// Available at root /health (for Render web service health probes) and /api/health
app.get("/health", handleHealthCheck);

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

apiRouter.get("/health", handleHealthCheck);
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
