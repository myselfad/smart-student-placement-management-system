import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validate } from "../../middleware/validate";
import { requireAuth, requireRole } from "../../middleware/auth";
import { RegisterStudentSchema, LoginSchema, InviteAdminSchema } from "shared-types";
import { Role } from "@prisma/client";

const router = Router();

router.post("/register", validate(RegisterStudentSchema), AuthController.registerStudent);
router.post("/login", validate(LoginSchema), AuthController.login);

// Super admin only route
router.post(
  "/admin/invite",
  requireAuth,
  requireRole([Role.SUPER_ADMIN]),
  validate(InviteAdminSchema),
  AuthController.inviteAdmin
);

export default router;
