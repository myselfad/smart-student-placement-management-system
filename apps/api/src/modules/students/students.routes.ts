import { Router } from "express";
import { StudentsController } from "./students.controller";
import { requireAuth, requireRole, STAFF_ROLES } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { UpdateProfileSchema } from "shared-types";
import { upload } from "../../middleware/upload";
import { requireSecureFile } from "../../middleware/fileSecurity";
import { Role } from "@prisma/client";

const router = Router();

router.use(requireAuth);

// Staff: student directory
router.get("/", requireRole(STAFF_ROLES), StudentsController.listAll);

// Student self-service
router.get("/me/profile", requireRole([Role.STUDENT]), StudentsController.getMyProfile);
router.put("/me/profile", requireRole([Role.STUDENT]), validate(UpdateProfileSchema), StudentsController.updateMyProfile);
router.post("/me/resume", requireRole([Role.STUDENT]), upload.single("resume"), requireSecureFile, StudentsController.uploadResume);

export default router;
