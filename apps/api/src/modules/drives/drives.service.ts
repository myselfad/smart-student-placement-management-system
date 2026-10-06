import prisma from "../../lib/prisma";
import { CreateDriveData } from "shared-types";
import { DriveStatus } from "@prisma/client";

const driveInclude = {
  company: true,
  eligibilityCriteria: true,
  requiredSkills: { include: { skill: true } },
  _count: { select: { applications: true } },
};

async function notifyStudentsOfOpenDrive(driveId: string) {
  const drive = await prisma.placementDrive.findUnique({ where: { id: driveId }, include: { company: true } });
  if (!drive) return;
  const students = await prisma.user.findMany({ where: { role: "STUDENT", isActive: true }, select: { id: true } });
  if (students.length === 0) return;
  await prisma.notification.createMany({
    data: students.map((s) => ({
      recipientId: s.id,
      type: "DRIVE_PUBLISHED",
      title: `New drive: ${drive.company.name}`,
      body: `${drive.title} is now open. Apply before ${drive.applicationDeadline.toDateString()}.`,
      relatedEntityType: "DRIVE",
      relatedEntityId: drive.id,
    })),
  });
}

export class DrivesService {
  static async getAll(statusFilter?: string) {
    return prisma.placementDrive.findMany({
      where: statusFilter ? { status: statusFilter as DriveStatus } : undefined,
      include: driveInclude,
      orderBy: { createdAt: "desc" },
    });
  }

  static async getById(id: string) {
    const drive = await prisma.placementDrive.findUnique({ where: { id }, include: driveInclude });
    if (!drive) throw new Error("Drive not found");
    return drive;
  }

  static async create(adminId: string, data: CreateDriveData) {
    const {
      companyId, title, description, location, compensation, jobType,
      openings, applicationDeadline, selectionProcess, status,
      minCgpa, maxBacklogs, allowedBranches, allowedGraduationYears, requiredSkills,
    } = data;

    const skillNames = Array.from(new Set((requiredSkills ?? []).map((s) => s.trim()).filter(Boolean)));
    const skills = await Promise.all(
      skillNames.map((name) => prisma.skill.upsert({ where: { name }, update: {}, create: { name } }))
    );

    const drive = await prisma.placementDrive.create({
      data: {
        companyId, title, description, location, compensation, jobType,
        openings, applicationDeadline: new Date(applicationDeadline),
        selectionProcess,
        status: (status as DriveStatus) ?? "OPEN",
        createdByUserId: adminId,
        eligibilityCriteria: {
          create: { minCgpa, maxBacklogs, allowedBranches, allowedGraduationYears },
        },
        requiredSkills: { create: skills.map((s) => ({ skillId: s.id })) },
      },
      include: driveInclude,
    });

    if (drive.status === "OPEN") await notifyStudentsOfOpenDrive(drive.id);
    return drive;
  }

  static async updateStatus(id: string, status: DriveStatus) {
    const existing = await prisma.placementDrive.findUnique({ where: { id } });
    if (!existing) throw new Error("Drive not found");
    const drive = await prisma.placementDrive.update({ where: { id }, data: { status }, include: driveInclude });
    if (status === "OPEN" && existing.status !== "OPEN") await notifyStudentsOfOpenDrive(id);
    return drive;
  }

  static async getApplicants(driveId: string) {
    return prisma.application.findMany({
      where: { driveId },
      include: {
        studentProfile: {
          include: {
            user: { select: { email: true } },
            studentSkills: { include: { skill: true } },
          },
        },
        resume: true,
      },
      orderBy: { appliedAt: "desc" },
    });
  }
}
