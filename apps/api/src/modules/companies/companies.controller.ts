import { Request, Response } from "express";
import { CompaniesService } from "./companies.service";

export class CompaniesController {
  static async getAll(req: Request, res: Response) {
    const companies = await CompaniesService.getAll();
    res.json(companies);
  }

  static async create(req: Request, res: Response) {
    const company = await CompaniesService.create(req.body);
    res.status(201).json(company);
  }

  static async archive(req: Request, res: Response) {
    await CompaniesService.archive(req.params.id as string);
    res.status(204).send();
  }
}
