import prisma from "../../lib/prisma";
import { ApplicationStatus, Role } from "@prisma/client";
import { EligibilityEngine } from "../eligibility/eligibility.engine";

export class ApplicationsService {
  static async apply(userId: string, driveId: string) {
    // 1. Get student profile and drive
    const [profile, drive] = await Promise.all([
      prisma.studentProfile.findUnique({
        where: { userId },
        include: { resumes: { where: { isCurrent: true } }, studentSkills: { include: { skill: true } } }
      }),
      prisma.placementDrive.findUnique({
        where: { id: driveId },
        include: { eligibilityCriteria: true, requiredSkills: { include: { skill: true } } }
      })
    ]);

    if (!profile) throw new Error("Student profile not found");
    if (!drive) throw new Error("Drive not found");
    if (drive.status !== "OPEN") throw new Error("Drive is not open for applications");
    if (new Date() > drive.applicationDeadline) throw new Error("Applications closed on " + drive.applicationDeadline);

    // 2. Check if already applied
    const existingApp = await prisma.application.findUnique({
      where: { studentProfileId_driveId: { studentProfileId: profile.id, driveId } }
    });
    if (existingApp) throw new Error("You've already applied to this drive");

    // 3. Ensure profile is complete enough (e.g. has resume)
    const currentResume = profile.resumes[0];
    if (!currentResume) {
      throw new Error("Unable to evaluate — complete your profile (Missing resume)");
    }

    // 4. Evaluate eligibility server-side
    const criteria = drive.eligibilityCriteria ? {
      minCgpa: drive.eligibilityCriteria.minCgpa,
      maxBacklogs: drive.eligibilityCriteria.maxBacklogs,
      allowedBranches: drive.eligibilityCriteria.allowedBranches,
      allowedGraduationYears: drive.eligibilityCriteria.allowedGraduationYears,
      requiredSkills: drive.requiredSkills.map(rs => rs.skill.name)
    } : null;

    const profileSnapshot = {
      cgpa: profile.cgpa,
      branch: profile.branch,
      backlogCount: profile.backlogCount,
      graduationYear: profile.graduationYear,
      skills: profile.studentSkills.map(s => s.skill.name)
    };

    const eligibility = EligibilityEngine.evaluate(profileSnapshot, criteria);
    if (!eligibility.isEligible) {
      throw new Error("You are not eligible for this drive");
    }

    // 5. Create application and status history
    return prisma.$transaction(async (tx) => {
      const app = await tx.application.create({
        data: {
          studentProfileId: profile.id,
          driveId,
          resumeId: currentResume.id,
          status: ApplicationStatus.APPLIED,
        }
      });

      await tx.applicationStatusHistory.create({
        data: {
          applicationId: app.id,
          toStatus: ApplicationStatus.APPLIED,
          changedByUserId: userId,
          note: "Applied"
        }
      });

      // Lock the drive criteria if this is the first application
      if (drive.eligibilityCriteria && !drive.eligibilityCriteria.locked) {
        await tx.eligibilityCriteria.update({
          where: { driveId },
          data: { locked: true }
        });
      }

      return app;
    });
  }

  static async getMyApplications(userId: string) {
    const profile = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!profile) return [];

    return prisma.application.findMany({
      where: { studentProfileId: profile.id },
      include: {
        drive: { include: { company: true } },
        statusHistory: { orderBy: { changedAt: "asc" } },
      },
      orderBy: { appliedAt: "desc" }
    });
  }

  static async getApplicationDetail(id: string, requestingUser: { id: string, role: Role }) {
    const app = await prisma.application.findUnique({
      where: { id },
      include: {
        drive: { include: { company: true } },
        statusHistory: { orderBy: { changedAt: "desc" } }
      }
    });

    if (!app) throw new Error("Application not found");

    if (requestingUser.role === Role.STUDENT) {
      const profile = await prisma.studentProfile.findUnique({ where: { userId: requestingUser.id } });
      if (!profile || app.studentProfileId !== profile.id) {
        throw new Error("Access denied");
      }
    }
    return app;
  }

  static async listAll(status?: string) {
    return prisma.application.findMany({
      where: status ? { status: status as ApplicationStatus } : undefined,
      include: {
        studentProfile: { include: { user: { select: { email: true } } } },
        drive: { include: { company: true } },
        resume: true,
      },
      orderBy: { appliedAt: "desc" },
    });
  }

  static async updateStatus(applicationId: string, toStatus: ApplicationStatus, adminId: string, note?: string) {
    return prisma.$transaction(async (tx) => {
      const app = await tx.application.findUnique({
        where: { id: applicationId },
        include: { studentProfile: true, drive: { include: { company: true } } },
      });
      if (!app) throw new Error("Application not found");

      const label = toStatus.replace(/_/g, " ").toLowerCase();
      await tx.notification.create({
        data: {
          recipientId: app.studentProfile.userId,
          type: "STATUS_CHANGE",
          title: `${app.drive.company.name}: application ${label}`,
          body: `Your application for ${app.drive.title} moved to "${label}".${note ? " Note: " + note : ""}`,
          relatedEntityType: "APPLICATION",
          relatedEntityId: app.id,
        },
      });

      // Validate transitions based on BR-6 (Simplified for MVP, allowing Admin flexibility but normally constrained)
      // Terminal states check could go here

      await tx.applicationStatusHistory.create({
        data: {
          applicationId,
          fromStatus: app.status,
          toStatus,
          changedByUserId: adminId,
          note
        }
      });

      return tx.application.update({
        where: { id: applicationId },
        data: { status: toStatus }
      });
    });
  }
}
