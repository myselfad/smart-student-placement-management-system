import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validate } from "../../middleware/validate";
import { requireAuth, requireRole } from "../../middleware/auth";
import { RegisterStudentSchema, LoginSchema, InviteAdminSchema } from "shared-types";
import { Role } from "@prisma/client";

import rateLimit from "express-rate-limit";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 auth requests per window
  message: "Too many login/register attempts from this IP, please try again after 15 minutes"
});

const router = Router();

router.post("/register", authLimiter, validate(RegisterStudentSchema), AuthController.registerStudent);
router.post("/login", authLimiter, validate(LoginSchema), AuthController.login);

// Super admin only route
router.post(
  "/admin/invite",
  requireAuth,
  requireRole([Role.SUPER_ADMIN]),
  validate(InviteAdminSchema),
  AuthController.inviteAdmin
);

export default router;
