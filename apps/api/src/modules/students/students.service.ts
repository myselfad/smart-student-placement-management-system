import prisma from "../../lib/prisma";
import { UpdateProfileData } from "shared-types";

export class StudentsService {
  static async getProfile(userId: string) {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        resumes: { orderBy: { uploadedAt: "desc" } },
        studentSkills: { include: { skill: true } },
        projects: true,
        certifications: true,
        achievements: true,
        experiences: true,
      },
    });

    if (!profile) {
      throw new Error("Profile not found");
    }

    return profile;
  }

  static async updateProfile(userId: string, data: UpdateProfileData) {
    // Basic profile completion logic (simplified for MVP)
    const completionPct = [
      data.fullName, data.phone, data.branch, data.cgpa, data.graduationYear
    ].filter(Boolean).length * 20; // 5 fields * 20 = 100% (approx)

    return prisma.studentProfile.update({
      where: { userId },
      data: {
        ...data,
        profileCompletionPct: completionPct > 100 ? 100 : completionPct,
      },
    });
  }

  static async uploadResume(userId: string, fileUrl: string, fileName: string) {
    const profile = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!profile) {
      throw new Error("Profile not found");
    }

    // Mark existing current resumes as false
    await prisma.resume.updateMany({
      where: { studentProfileId: profile.id, isCurrent: true },
      data: { isCurrent: false },
    });

    // Create new resume
    return prisma.resume.create({
      data: {
        studentProfileId: profile.id,
        fileUrl,
        fileName,
        isCurrent: true,
      },
    });
  }
}
