import prisma from "../../lib/prisma";
import { CreateDriveData } from "shared-types";

export class DrivesService {
  static async getAll(statusFilter?: string) {
    return prisma.placementDrive.findMany({
      where: statusFilter ? { status: statusFilter as any } : undefined,
      include: {
        company: true,
        eligibilityCriteria: true,
      },
      orderBy: { createdAt: "desc" }
    });
  }

  static async getById(id: string) {
    const drive = await prisma.placementDrive.findUnique({
      where: { id },
      include: {
        company: true,
        eligibilityCriteria: true,
        _count: { select: { applications: true } }
      }
    });
    if (!drive) throw new Error("Drive not found");
    return drive;
  }

  static async create(adminId: string, data: CreateDriveData) {
    const { 
      companyId, title, description, location, compensation, jobType, 
      openings, applicationDeadline, selectionProcess,
      minCgpa, maxBacklogs, allowedBranches, allowedGraduationYears
    } = data;

    return prisma.placementDrive.create({
      data: {
        companyId, title, description, location, compensation, jobType,
        openings, applicationDeadline: new Date(applicationDeadline),
        selectionProcess,
        createdByUserId: adminId,
        eligibilityCriteria: {
          create: {
            minCgpa,
            maxBacklogs,
            allowedBranches,
            allowedGraduationYears
          }
        }
      },
      include: { eligibilityCriteria: true }
    });
  }
}
