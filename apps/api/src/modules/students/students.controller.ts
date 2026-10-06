import { Response } from "express";
import { StudentsService } from "./students.service";
import { AuthRequest } from "../../middleware/auth";
import { getStorageService } from "../../services/storage.service";

export class StudentsController {
  static async listAll(req: AuthRequest, res: Response) {
    res.json(await StudentsService.listAll());
  }

  static async getMyProfile(req: AuthRequest, res: Response) {
    try {
      const profile = await StudentsService.getProfile(req.user!.id);
      res.json(profile);
    } catch (error: any) {
      res.status(404).json({ error: { message: error.message } });
    }
  }

  static async updateMyProfile(req: AuthRequest, res: Response) {
    try {
      const profile = await StudentsService.updateProfile(req.user!.id, req.body);
      res.json(profile);
    } catch (error: any) {
      res.status(400).json({ error: { message: error.message } });
    }
  }

  static async uploadResume(req: AuthRequest, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: { message: "No file uploaded" } });
      }
      const storageService = getStorageService();
      const fileUrl = await storageService.uploadFile(req.file, req.user!.id);
      const resume = await StudentsService.uploadResume(req.user!.id, fileUrl, req.file.originalname);
      res.status(201).json(resume);
    } catch (error: any) {
      res.status(400).json({ error: { message: error.message } });
    }
  }
}
