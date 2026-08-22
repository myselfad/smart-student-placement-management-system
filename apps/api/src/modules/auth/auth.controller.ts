import { Request, Response } from "express";
import { AuthService } from "./auth.service";

export class AuthController {
  static async registerStudent(req: Request, res: Response) {
    try {
      const result = await AuthService.registerStudent(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      if (error.message === "Email already in use") {
        return res.status(409).json({ error: { code: "CONFLICT", message: error.message } });
      }
      throw error;
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const result = await AuthService.login(req.body);
      res.json(result);
    } catch (error: any) {
      if (error.message === "Invalid email or password" || error.message === "Account is deactivated") {
        return res.status(401).json({ error: { code: "UNAUTHORIZED", message: error.message } });
      }
      throw error;
    }
  }

  static async inviteAdmin(req: Request, res: Response) {
    try {
      const result = await AuthService.inviteAdmin(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      if (error.message === "Email already in use") {
        return res.status(409).json({ error: { code: "CONFLICT", message: error.message } });
      }
      throw error;
    }
  }
}
