import { z } from "zod";

// --- Enums ---
export const RoleEnum = z.enum(["STUDENT", "ADMIN", "SUPER_ADMIN", "EDITOR"]);
export type Role = z.infer<typeof RoleEnum>;

export const DriveStatusEnum = z.enum(["DRAFT", "OPEN", "CLOSED", "ARCHIVED"]);
export type DriveStatus = z.infer<typeof DriveStatusEnum>;

export const ApplicationStatusEnum = z.enum([
  "APPLIED",
  "SHORTLISTED",
  "ASSESSMENT",
  "TECHNICAL_INTERVIEW",
  "HR_INTERVIEW",
  "SELECTED",
  "REJECTED",
]);
export type ApplicationStatus = z.infer<typeof ApplicationStatusEnum>;

// --- Auth Schemas ---
export const RegisterStudentSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  fullName: z.string().min(2, "Full name is required"),
});
export type RegisterStudentData = z.infer<typeof RegisterStudentSchema>;

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});
export type LoginData = z.infer<typeof LoginSchema>;

export const InviteAdminSchema = z.object({
  email: z.string().email(),
  role: z.enum(["ADMIN", "SUPER_ADMIN", "EDITOR"]),
});
export type InviteAdminData = z.infer<typeof InviteAdminSchema>;

// --- Profile Schemas ---
export const UpdateProfileSchema = z.object({
  fullName: z.string().optional(),
  phone: z.string().optional(),
  branch: z.string().optional(),
  yearOfStudy: z.number().int().positive().optional(),
  graduationYear: z.number().int().positive().optional(),
  cgpa: z.number().min(0).max(10).optional(),
  backlogCount: z.number().int().min(0).optional(),
  skills: z.array(z.string()).optional(),
});
export type UpdateProfileData = z.infer<typeof UpdateProfileSchema>;

// --- Drive Schemas ---
export const CreateDriveSchema = z.object({
  companyId: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  compensation: z.string().min(1, "Compensation is required"),
  jobType: z.string().min(1, "Job type is required"),
  selectionProcess: z.string().optional(),
  openings: z.number().int().min(1),
  applicationDeadline: z.string().datetime(),
  status: DriveStatusEnum.optional(),

  // Eligibility Criteria
  minCgpa: z.number().min(0).max(10).optional(),
  allowedBranches: z.array(z.string()).min(1, "At least one branch is required"),
  maxBacklogs: z.number().int().min(0).optional(),
  allowedGraduationYears: z.array(z.number().int().positive()).min(1, "At least one graduation year is required"),
  requiredSkills: z.array(z.string()).optional(),
});
export type CreateDriveData = z.infer<typeof CreateDriveSchema>;

export const UpdateDriveStatusSchema = z.object({
  status: DriveStatusEnum,
});
export type UpdateDriveStatusData = z.infer<typeof UpdateDriveStatusSchema>;

// --- Application Schemas ---
export const UpdateApplicationStatusSchema = z.object({
  status: ApplicationStatusEnum,
  note: z.string().optional(),
});
export type UpdateApplicationStatusData = z.infer<typeof UpdateApplicationStatusSchema>;

// --- Announcement Schemas ---
export const CreateAnnouncementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Message is required"),
  branch: z.string().optional(),
  graduationYear: z.number().int().positive().optional(),
});
export type CreateAnnouncementData = z.infer<typeof CreateAnnouncementSchema>;
