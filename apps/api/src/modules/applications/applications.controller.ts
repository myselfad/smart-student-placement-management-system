import { Request, Response } from "express";
import { ApplicationsService } from "./applications.service";
import { AuthRequest } from "../../middleware/auth";
import { ApplicationStatus } from "@prisma/client";

export class ApplicationsController {
  static async apply(req: AuthRequest, res: Response) {
    try {
      const app = await ApplicationsService.apply(req.user!.id, req.params.driveId as string);
      res.status(201).json(app);
    } catch (error: any) {
      if (error.message === "You've already applied to this drive") {
        return res.status(409).json({ error: { message: error.message } });
      }
      res.status(400).json({ error: { message: error.message } });
    }
  }

  static async getMyApplications(req: AuthRequest, res: Response) {
    const apps = await ApplicationsService.getMyApplications(req.user!.id);
    res.json(apps);
  }

  static async listAll(req: AuthRequest, res: Response) {
    res.json(await ApplicationsService.listAll(req.query.status as string | undefined));
  }

  static async getById(req: AuthRequest, res: Response) {
    try {
      const app = await ApplicationsService.getApplicationDetail(req.params.id as string, req.user!);
      res.json(app);
    } catch (error: any) {
      res.status(error.message === "Access denied" ? 403 : 404).json({ error: { message: error.message } });
    }
  }

  static async updateStatus(req: AuthRequest, res: Response) {
    try {
      const { status, note } = req.body;
      const app = await ApplicationsService.updateStatus(req.params.id as string, status as ApplicationStatus, req.user!.id, note);
      res.json(app);
    } catch (error: any) {
      res.status(400).json({ error: { message: error.message } });
    }
  }
}
