import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth";
import { Role } from "@prisma/client";
import { EligibilityController } from "./eligibility.controller";

const router = Router();

router.use(requireAuth);

// Only students can check their own eligibility for a drive
router.get(
  "/drives/:id",
  requireRole([Role.STUDENT]),
  EligibilityController.checkEligibility
);

export default router;
