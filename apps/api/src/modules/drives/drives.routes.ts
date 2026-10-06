import { Router } from "express";
import { DrivesController } from "./drives.controller";
import { requireAuth, requireRole, STAFF_ROLES } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { CreateDriveSchema, UpdateDriveStatusSchema } from "shared-types";
import { Role } from "@prisma/client";
import { EligibilityController } from "../eligibility/eligibility.controller";

const router = Router();

router.use(requireAuth);

router.get("/", DrivesController.getAll);
router.get("/:id", DrivesController.getById);

// Student eligibility check
router.get("/:id/eligibility", requireRole([Role.STUDENT]), EligibilityController.checkEligibility);

// Staff routes
router.post("/", requireRole(STAFF_ROLES), validate(CreateDriveSchema), DrivesController.create);
router.patch("/:id/status", requireRole(STAFF_ROLES), validate(UpdateDriveStatusSchema), DrivesController.updateStatus);
router.get("/:id/applications", requireRole(STAFF_ROLES), DrivesController.getApplicants);

export default router;
