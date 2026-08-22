import { Router } from "express";
import { NotificationsController } from "./notifications.controller";
import { requireAuth } from "../../middleware/auth";

const router = Router();

router.use(requireAuth);

router.get("/", NotificationsController.getMyNotifications);
router.patch("/read-all", NotificationsController.markAllAsRead);
router.patch("/:id/read", NotificationsController.markAsRead);

export default router;
