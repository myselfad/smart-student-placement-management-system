import { Request, Response } from "express";
import { DashboardService } from "./dashboard.service";
import { AuthRequest } from "../../middleware/auth";

export class DashboardController {
  static async getStudentDashboard(req: AuthRequest, res: Response) {
    const data = await DashboardService.getStudentDashboard(req.user!.id);
    res.json(data);
  }

  static async getAdminDashboard(req: AuthRequest, res: Response) {
    const data = await DashboardService.getAdminDashboard();
    res.json(data);
  }
}
