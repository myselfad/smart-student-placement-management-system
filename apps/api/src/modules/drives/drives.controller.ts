import { Request, Response } from "express";
import { DrivesService } from "./drives.service";
import { AuthRequest } from "../../middleware/auth";

export class DrivesController {
  static async getAll(req: Request, res: Response) {
    const status = req.query.status as string;
    const drives = await DrivesService.getAll(status);
    res.json(drives);
  }

  static async getById(req: Request, res: Response) {
    try {
      const drive = await DrivesService.getById(req.params.id as string);
      res.json(drive);
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
}
