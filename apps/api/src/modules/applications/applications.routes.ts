import { Router } from "express";
import { ApplicationsController } from "./applications.controller";
import { requireAuth, requireRole } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { UpdateApplicationStatusSchema } from "shared-types";
import { Role } from "@prisma/client";

const router = Router();

router.use(requireAuth);

router.post("/me", requireRole([Role.STUDENT]), ApplicationsController.getMyApplications);
router.post("/drive/:driveId/apply", requireRole([Role.STUDENT]), ApplicationsController.apply);
router.get("/:id", ApplicationsController.getById);

// Admin routes
router.patch(
  "/:id/status",
  requireRole([Role.ADMIN, Role.SUPER_ADMIN]),
  validate(UpdateApplicationStatusSchema),
  ApplicationsController.updateStatus
);

export default router;
