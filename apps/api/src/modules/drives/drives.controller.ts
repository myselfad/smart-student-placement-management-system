import { Request, Response } from "express";
import { DrivesService } from "./drives.service";
import { AuthRequest } from "../../middleware/auth";

export class DrivesController {
  static async getAll(req: AuthRequest, res: Response) {
    let status = req.query.status as string | undefined;
    // Students only ever see open drives
    if (req.user?.role === "STUDENT") status = "OPEN";
    res.json(await DrivesService.getAll(status));
  }

  static async getById(req: Request, res: Response) {
    try {
      res.json(await DrivesService.getById(req.params.id as string));
    } catch (error: any) {
      res.status(404).json({ error: { message: error.message } });
    }
  }

  static async create(req: AuthRequest, res: Response) {
    try {
      const drive = await DrivesService.create(req.user!.id, req.body);
      res.status(201).json(drive);
    } catch (error: any) {
      res.status(400).json({ error: { message: error.message } });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      res.json(await DrivesService.updateStatus(req.params.id as string, req.body.status));
    } catch (error: any) {
      res.status(400).json({ error: { message: error.message } });
    }
  }

  static async getApplicants(req: Request, res: Response) {
    res.json(await DrivesService.getApplicants(req.params.id as string));
  }
}
