import prisma from "../../lib/prisma";
import { UpdateProfileData } from "shared-types";

function computeCompletion(p: {
  fullName?: string | null; phone?: string | null; branch?: string | null;
  cgpa?: number | null; graduationYear?: number | null; yearOfStudy?: number | null;
  skillCount: number; hasResume: boolean;
}) {
  const checks = [
    !!p.fullName, !!p.phone, !!p.branch, p.cgpa != null, p.graduationYear != null,
    p.yearOfStudy != null, p.skillCount > 0, p.hasResume,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

const profileInclude = {
  user: { select: { email: true } },
  resumes: { orderBy: { uploadedAt: "desc" as const } },
  studentSkills: { include: { skill: true } },
  projects: true,
  certifications: true,
  achievements: true,
  experiences: true,
};

export class StudentsService {
  static async getProfile(userId: string) {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: profileInclude,
    });
    if (!profile) throw new Error("Profile not found");
    return profile;
  }

  static async updateProfile(userId: string, data: UpdateProfileData) {
    const { skills, ...fields } = data;
    const existing = await prisma.studentProfile.findUnique({
      where: { userId },
      include: { resumes: { where: { isCurrent: true } }, studentSkills: true },
    });
    if (!existing) throw new Error("Profile not found");

    return prisma.$transaction(async (tx) => {
      let skillCount = existing.studentSkills.length;

      if (skills) {
        const clean = Array.from(new Set(skills.map((s) => s.trim()).filter(Boolean)));
        await tx.studentSkill.deleteMany({ where: { studentProfileId: existing.id } });
        for (const name of clean) {
          const skill = await tx.skill.upsert({ where: { name }, update: {}, create: { name } });
          await tx.studentSkill.create({ data: { studentProfileId: existing.id, skillId: skill.id } });
        }
        skillCount = clean.length;
      }

      const merged = { ...existing, ...fields };
      const profileCompletionPct = computeCompletion({
        ...merged,
        skillCount,
        hasResume: existing.resumes.length > 0,
      });

      await tx.studentProfile.update({
        where: { userId },
        data: { ...fields, profileCompletionPct },
      });

      return tx.studentProfile.findUnique({ where: { userId }, include: profileInclude });
    });
  }

  static async uploadResume(userId: string, fileUrl: string, fileName: string) {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: { studentSkills: true },
    });
    if (!profile) throw new Error("Profile not found");

    await prisma.resume.updateMany({
      where: { studentProfileId: profile.id, isCurrent: true },
      data: { isCurrent: false },
    });

    const resume = await prisma.resume.create({
      data: { studentProfileId: profile.id, fileUrl, fileName, isCurrent: true },
    });

    await prisma.studentProfile.update({
      where: { id: profile.id },
      data: {
        profileCompletionPct: computeCompletion({
          ...profile,
          skillCount: profile.studentSkills.length,
          hasResume: true,
        }),
      },
    });

    return resume;
  }

  /** Staff view: every student with key academic data and application stats. */
  static async listAll() {
    const students = await prisma.studentProfile.findMany({
      include: {
        user: { select: { email: true, isActive: true, createdAt: true } },
        studentSkills: { include: { skill: true } },
        resumes: { where: { isCurrent: true } },
        applications: { select: { status: true } },
      },
      orderBy: { fullName: "asc" },
    });

    return students.map((s) => ({
      id: s.id,
      userId: s.userId,
      fullName: s.fullName,
      email: s.user.email,
      isActive: s.user.isActive,
      phone: s.phone,
      branch: s.branch,
      yearOfStudy: s.yearOfStudy,
      graduationYear: s.graduationYear,
      cgpa: s.cgpa,
      backlogCount: s.backlogCount,
      profileCompletionPct: s.profileCompletionPct,
      skills: s.studentSkills.map((ss) => ss.skill.name),
      resumeUrl: s.resumes[0]?.fileUrl ?? null,
      applicationCount: s.applications.length,
      isPlaced: s.applications.some((a) => a.status === "SELECTED"),
    }));
  }
}
