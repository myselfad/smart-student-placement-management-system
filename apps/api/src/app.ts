import express from "express";
import cors from "cors";
import "express-async-errors";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

import rateLimit from "express-rate-limit";

// Middleware
app.use(cors());
app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: "Too many requests from this IP, please try again later"
});
app.use("/api", apiLimiter);

import authRoutes from "./modules/auth/auth.routes";
import studentsRoutes from "./modules/students/students.routes";
import companiesRoutes from "./modules/companies/companies.routes";
import drivesRoutes from "./modules/drives/drives.routes";
import applicationsRoutes from "./modules/applications/applications.routes";
import notificationsRoutes from "./modules/notifications/notifications.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import path from "path";

// Routes
const apiRouter = express.Router();
apiRouter.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

apiRouter.use("/auth", authRoutes);
apiRouter.use("/students", studentsRoutes);
apiRouter.use("/companies", companiesRoutes);
apiRouter.use("/drives", drivesRoutes);
apiRouter.use("/applications", applicationsRoutes);
apiRouter.use("/notifications", notificationsRoutes);
apiRouter.use("/dashboard", dashboardRoutes);

app.use("/api", apiRouter);

// Serve uploads statically (for MVP local dev)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Global Error Handler
app.use(errorHandler);

export default app;
