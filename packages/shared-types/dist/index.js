"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateApplicationStatusSchema = exports.CreateDriveSchema = exports.UpdateProfileSchema = exports.InviteAdminSchema = exports.LoginSchema = exports.RegisterStudentSchema = exports.ApplicationStatusEnum = exports.DriveStatusEnum = exports.RoleEnum = void 0;
const zod_1 = require("zod");
// --- Enums ---
exports.RoleEnum = zod_1.z.enum(["STUDENT", "ADMIN", "SUPER_ADMIN"]);
exports.DriveStatusEnum = zod_1.z.enum(["DRAFT", "OPEN", "CLOSED", "ARCHIVED"]);
exports.ApplicationStatusEnum = zod_1.z.enum([
    "APPLIED",
    "SHORTLISTED",
    "ASSESSMENT",
    "TECHNICAL_INTERVIEW",
    "HR_INTERVIEW",
    "SELECTED",
    "REJECTED",
]);
// --- Auth Schemas ---
exports.RegisterStudentSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters long"),
    fullName: zod_1.z.string().min(2, "Full name is required"),
});
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1, "Password is required"),
});
exports.InviteAdminSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    role: zod_1.z.enum(["ADMIN", "SUPER_ADMIN"]),
});
// --- Profile Schemas ---
exports.UpdateProfileSchema = zod_1.z.object({
    fullName: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
    branch: zod_1.z.string().optional(),
    yearOfStudy: zod_1.z.number().int().positive().optional(),
    graduationYear: zod_1.z.number().int().positive().optional(),
    cgpa: zod_1.z.number().min(0).max(10).optional(),
    backlogCount: zod_1.z.number().int().min(0).optional(),
});
// --- Drive Schemas ---
exports.CreateDriveSchema = zod_1.z.object({
    companyId: zod_1.z.string().uuid(),
    title: zod_1.z.string().min(1, "Title is required"),
    description: zod_1.z.string().min(1, "Description is required"),
    location: zod_1.z.string().min(1, "Location is required"),
    compensation: zod_1.z.string().min(1, "Compensation is required"),
    jobType: zod_1.z.string().min(1, "Job type is required"),
    selectionProcess: zod_1.z.string().optional(),
    openings: zod_1.z.number().int().min(1),
    applicationDeadline: zod_1.z.string().datetime(),
    // Eligibility Criteria
    minCgpa: zod_1.z.number().min(0).max(10).optional(),
    allowedBranches: zod_1.z.array(zod_1.z.string()).min(1, "At least one branch is required"),
    maxBacklogs: zod_1.z.number().int().min(0).optional(),
    allowedGraduationYears: zod_1.z.array(zod_1.z.number().int().positive()).min(1, "At least one graduation year is required"),
    requiredSkills: zod_1.z.array(zod_1.z.string()).optional(),
});
// --- Application Schemas ---
exports.UpdateApplicationStatusSchema = zod_1.z.object({
    status: exports.ApplicationStatusEnum,
    note: zod_1.z.string().optional(),
});
