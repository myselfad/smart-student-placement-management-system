import { Router, Response } from "express";
import { requireAuth, requireRole, STAFF_ROLES, AuthRequest } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { CreateAnnouncementSchema } from "shared-types";
import { AnnouncementsService } from "./announcements.service";

const router = Router();

router.use(requireAuth);

router.get("/", async (req: AuthRequest, res: Response) => {
  res.json(await AnnouncementsService.list());
});

router.post("/", requireRole(STAFF_ROLES), validate(CreateAnnouncementSchema), async (req: AuthRequest, res: Response) => {
  res.status(201).json(await AnnouncementsService.create(req.user!.id, req.body));
});

export default router;
