import { z } from "zod";
export declare const RoleEnum: z.ZodEnum<["STUDENT", "ADMIN", "SUPER_ADMIN", "EDITOR"]>;
export type Role = z.infer<typeof RoleEnum>;
export declare const DriveStatusEnum: z.ZodEnum<["DRAFT", "OPEN", "CLOSED", "ARCHIVED"]>;
export type DriveStatus = z.infer<typeof DriveStatusEnum>;
export declare const ApplicationStatusEnum: z.ZodEnum<["APPLIED", "SHORTLISTED", "ASSESSMENT", "TECHNICAL_INTERVIEW", "HR_INTERVIEW", "SELECTED", "REJECTED"]>;
export type ApplicationStatus = z.infer<typeof ApplicationStatusEnum>;
export declare const RegisterStudentSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    fullName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    fullName: string;
}, {
    email: string;
    password: string;
    fullName: string;
}>;
export type RegisterStudentData = z.infer<typeof RegisterStudentSchema>;
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type LoginData = z.infer<typeof LoginSchema>;
export declare const InviteAdminSchema: z.ZodObject<{
    email: z.ZodString;
    role: z.ZodEnum<["ADMIN", "SUPER_ADMIN", "EDITOR"]>;
}, "strip", z.ZodTypeAny, {
    email: string;
    role: "ADMIN" | "SUPER_ADMIN" | "EDITOR";
}, {
    email: string;
    role: "ADMIN" | "SUPER_ADMIN" | "EDITOR";
}>;
export type InviteAdminData = z.infer<typeof InviteAdminSchema>;
export declare const UpdateProfileSchema: z.ZodObject<{
    fullName: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    branch: z.ZodOptional<z.ZodString>;
    yearOfStudy: z.ZodOptional<z.ZodNumber>;
    graduationYear: z.ZodOptional<z.ZodNumber>;
    cgpa: z.ZodOptional<z.ZodNumber>;
    backlogCount: z.ZodOptional<z.ZodNumber>;
    skills: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    fullName?: string | undefined;
    phone?: string | undefined;
    branch?: string | undefined;
    yearOfStudy?: number | undefined;
    graduationYear?: number | undefined;
    cgpa?: number | undefined;
    backlogCount?: number | undefined;
    skills?: string[] | undefined;
}, {
    fullName?: string | undefined;
    phone?: string | undefined;
    branch?: string | undefined;
    yearOfStudy?: number | undefined;
    graduationYear?: number | undefined;
    cgpa?: number | undefined;
    backlogCount?: number | undefined;
    skills?: string[] | undefined;
}>;
export type UpdateProfileData = z.infer<typeof UpdateProfileSchema>;
export declare const CreateDriveSchema: z.ZodObject<{
    companyId: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    location: z.ZodString;
    compensation: z.ZodString;
    jobType: z.ZodString;
    selectionProcess: z.ZodOptional<z.ZodString>;
    openings: z.ZodNumber;
    applicationDeadline: z.ZodString;
    status: z.ZodOptional<z.ZodEnum<["DRAFT", "OPEN", "CLOSED", "ARCHIVED"]>>;
    minCgpa: z.ZodOptional<z.ZodNumber>;
    allowedBranches: z.ZodArray<z.ZodString, "many">;
    maxBacklogs: z.ZodOptional<z.ZodNumber>;
    allowedGraduationYears: z.ZodArray<z.ZodNumber, "many">;
    requiredSkills: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    companyId: string;
    title: string;
    description: string;
    location: string;
    compensation: string;
    jobType: string;
    openings: number;
    applicationDeadline: string;
    allowedBranches: string[];
    allowedGraduationYears: number[];
    status?: "DRAFT" | "OPEN" | "CLOSED" | "ARCHIVED" | undefined;
    selectionProcess?: string | undefined;
    minCgpa?: number | undefined;
    maxBacklogs?: number | undefined;
    requiredSkills?: string[] | undefined;
}, {
    companyId: string;
    title: string;
    description: string;
    location: string;
    compensation: string;
    jobType: string;
    openings: number;
    applicationDeadline: string;
    allowedBranches: string[];
    allowedGraduationYears: number[];
    status?: "DRAFT" | "OPEN" | "CLOSED" | "ARCHIVED" | undefined;
    selectionProcess?: string | undefined;
    minCgpa?: number | undefined;
    maxBacklogs?: number | undefined;
    requiredSkills?: string[] | undefined;
}>;
export type CreateDriveData = z.infer<typeof CreateDriveSchema>;
export declare const UpdateDriveStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["DRAFT", "OPEN", "CLOSED", "ARCHIVED"]>;
}, "strip", z.ZodTypeAny, {
    status: "DRAFT" | "OPEN" | "CLOSED" | "ARCHIVED";
}, {
    status: "DRAFT" | "OPEN" | "CLOSED" | "ARCHIVED";
}>;
export type UpdateDriveStatusData = z.infer<typeof UpdateDriveStatusSchema>;
export declare const UpdateApplicationStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["APPLIED", "SHORTLISTED", "ASSESSMENT", "TECHNICAL_INTERVIEW", "HR_INTERVIEW", "SELECTED", "REJECTED"]>;
    note: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "APPLIED" | "SHORTLISTED" | "ASSESSMENT" | "TECHNICAL_INTERVIEW" | "HR_INTERVIEW" | "SELECTED" | "REJECTED";
    note?: string | undefined;
}, {
    status: "APPLIED" | "SHORTLISTED" | "ASSESSMENT" | "TECHNICAL_INTERVIEW" | "HR_INTERVIEW" | "SELECTED" | "REJECTED";
    note?: string | undefined;
}>;
export type UpdateApplicationStatusData = z.infer<typeof UpdateApplicationStatusSchema>;
export declare const CreateAnnouncementSchema: z.ZodObject<{
    title: z.ZodString;
    body: z.ZodString;
    branch: z.ZodOptional<z.ZodString>;
    graduationYear: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    title: string;
    body: string;
    branch?: string | undefined;
    graduationYear?: number | undefined;
}, {
    title: string;
    body: string;
    branch?: string | undefined;
    graduationYear?: number | undefined;
}>;
export type CreateAnnouncementData = z.infer<typeof CreateAnnouncementSchema>;
