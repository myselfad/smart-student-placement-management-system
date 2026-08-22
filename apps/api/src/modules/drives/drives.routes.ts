import { Router } from "express";
import { DrivesController } from "./drives.controller";
import { requireAuth, requireRole } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { CreateDriveSchema } from "shared-types";
import { Role } from "@prisma/client";
import { EligibilityController } from "../eligibility/eligibility.controller";

const router = Router();

router.use(requireAuth);

router.get("/", DrivesController.getAll);
router.get("/:id", DrivesController.getById);

// Student eligibility route
router.get("/:id/eligibility", requireRole([Role.STUDENT]), EligibilityController.checkEligibility);

// Admin routes
router.post(
  "/", 
  requireRole([Role.ADMIN, Role.SUPER_ADMIN]), 
  validate(CreateDriveSchema), 
  DrivesController.create
);

export default router;
