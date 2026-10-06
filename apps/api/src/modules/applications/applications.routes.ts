import { Router } from "express";
import { ApplicationsController } from "./applications.controller";
import { requireAuth, requireRole, STAFF_ROLES, MANAGER_ROLES } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { UpdateApplicationStatusSchema } from "shared-types";
import { Role } from "@prisma/client";

const router = Router();

router.use(requireAuth);

// Student
router.get("/me", requireRole([Role.STUDENT]), ApplicationsController.getMyApplications);
router.post("/me", requireRole([Role.STUDENT]), ApplicationsController.getMyApplications); // legacy
router.post("/drive/:driveId/apply", requireRole([Role.STUDENT]), ApplicationsController.apply);

// Staff
router.get("/admin", requireRole(STAFF_ROLES), ApplicationsController.listAll);
router.patch(
  "/:id/status",
  requireRole(MANAGER_ROLES),
  validate(UpdateApplicationStatusSchema),
  ApplicationsController.updateStatus
);

router.get("/:id", ApplicationsController.getById);

export default router;
