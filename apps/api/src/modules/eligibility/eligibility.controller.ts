import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import prisma from "../../lib/prisma";
import { EligibilityEngine, ProfileSnapshot, DriveCriteria } from "./eligibility.engine";

export class EligibilityController {
  static async checkEligibility(req: AuthRequest, res: Response) {
    const driveId = req.params.id as string;
    const userId = req.user!.id;

    const [drive, profile] = await Promise.all([
      prisma.placementDrive.findUnique({
        where: { id: driveId },
        include: { eligibilityCriteria: true, requiredSkills: { include: { skill: true } } }
      }),
      prisma.studentProfile.findUnique({
        where: { userId },
        include: { studentSkills: { include: { skill: true } } }
      })
    ]);

    if (!drive) return res.status(404).json({ error: { message: "Drive not found" } });
    if (!profile) return res.status(400).json({ error: { message: "Student profile not found" } });

    const profileSnapshot: ProfileSnapshot = {
      cgpa: profile.cgpa,
      branch: profile.branch,
      backlogCount: profile.backlogCount,
      graduationYear: profile.graduationYear,
      skills: profile.studentSkills.map(s => s.skill.name)
    };

    const criteria: DriveCriteria | null = drive.eligibilityCriteria ? {
      minCgpa: drive.eligibilityCriteria.minCgpa,
      maxBacklogs: drive.eligibilityCriteria.maxBacklogs,
      allowedBranches: drive.eligibilityCriteria.allowedBranches,
      allowedGraduationYears: drive.eligibilityCriteria.allowedGraduationYears,
      requiredSkills: drive.requiredSkills.map(rs => rs.skill.name)
    } : null;

    const result = EligibilityEngine.evaluate(profileSnapshot, criteria);
    res.json(result);
  }
}
