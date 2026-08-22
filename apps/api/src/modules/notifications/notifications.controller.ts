import { Request, Response } from "express";
import { NotificationsService } from "./notifications.service";
import { AuthRequest } from "../../middleware/auth";

export class NotificationsController {
  static async getMyNotifications(req: AuthRequest, res: Response) {
    const notifications = await NotificationsService.getMyNotifications(req.user!.id);
    res.json(notifications);
  }

  static async markAsRead(req: AuthRequest, res: Response) {
    await NotificationsService.markAsRead(req.params.id as string, req.user!.id);
    res.json({ success: true });
  }

  static async markAllAsRead(req: AuthRequest, res: Response) {
    await NotificationsService.markAllAsRead(req.user!.id);
    res.json({ success: true });
  }
}
