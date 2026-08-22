import { Router } from "express";
import { DashboardController } from "./dashboard.controller";
import { requireAuth, requireRole } from "../../middleware/auth";
import { Role } from "@prisma/client";

const router = Router();

router.use(requireAuth);

router.get("/student", requireRole([Role.STUDENT]), DashboardController.getStudentDashboard);
router.get("/admin", requireRole([Role.ADMIN, Role.SUPER_ADMIN]), DashboardController.getAdminDashboard);

export default router;
