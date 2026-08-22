import { Router } from "express";
import { CompaniesController } from "./companies.controller";
import { requireAuth, requireRole } from "../../middleware/auth";
import { Role } from "@prisma/client";

const router = Router();

router.use(requireAuth);

router.get("/", CompaniesController.getAll);

// Only admins can modify companies
router.post("/", requireRole([Role.ADMIN, Role.SUPER_ADMIN]), CompaniesController.create);
router.patch("/:id/archive", requireRole([Role.ADMIN, Role.SUPER_ADMIN]), CompaniesController.archive);

export default router;
