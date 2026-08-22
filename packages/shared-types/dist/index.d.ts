import { z } from "zod";
export declare const RoleEnum: z.ZodEnum<{
    STUDENT: "STUDENT";
    ADMIN: "ADMIN";
    SUPER_ADMIN: "SUPER_ADMIN";
}>;
export type Role = z.infer<typeof RoleEnum>;
export declare const DriveStatusEnum: z.ZodEnum<{
    DRAFT: "DRAFT";
    OPEN: "OPEN";
    CLOSED: "CLOSED";
    ARCHIVED: "ARCHIVED";
}>;
export type DriveStatus = z.infer<typeof DriveStatusEnum>;
export declare const ApplicationStatusEnum: z.ZodEnum<{
    APPLIED: "APPLIED";
    SHORTLISTED: "SHORTLISTED";
    ASSESSMENT: "ASSESSMENT";
    TECHNICAL_INTERVIEW: "TECHNICAL_INTERVIEW";
    HR_INTERVIEW: "HR_INTERVIEW";
    SELECTED: "SELECTED";
    REJECTED: "REJECTED";
}>;
export type ApplicationStatus = z.infer<typeof ApplicationStatusEnum>;
export declare const RegisterStudentSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    fullName: z.ZodString;
}, z.core.$strip>;
export type RegisterStudentData = z.infer<typeof RegisterStudentSchema>;
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export type LoginData = z.infer<typeof LoginSchema>;
export declare const InviteAdminSchema: z.ZodObject<{
    email: z.ZodString;
    role: z.ZodEnum<{
        ADMIN: "ADMIN";
        SUPER_ADMIN: "SUPER_ADMIN";
    }>;
}, z.core.$strip>;
export type InviteAdminData = z.infer<typeof InviteAdminSchema>;
export declare const UpdateProfileSchema: z.ZodObject<{
    fullName: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    branch: z.ZodOptional<z.ZodString>;
    yearOfStudy: z.ZodOptional<z.ZodNumber>;
    graduationYear: z.ZodOptional<z.ZodNumber>;
    cgpa: z.ZodOptional<z.ZodNumber>;
    backlogCount: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
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
    minCgpa: z.ZodOptional<z.ZodNumber>;
    allowedBranches: z.ZodArray<z.ZodString>;
    maxBacklogs: z.ZodOptional<z.ZodNumber>;
    allowedGraduationYears: z.ZodArray<z.ZodNumber>;
    requiredSkills: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type CreateDriveData = z.infer<typeof CreateDriveSchema>;
export declare const UpdateApplicationStatusSchema: z.ZodObject<{
    status: z.ZodEnum<{
        APPLIED: "APPLIED";
        SHORTLISTED: "SHORTLISTED";
        ASSESSMENT: "ASSESSMENT";
        TECHNICAL_INTERVIEW: "TECHNICAL_INTERVIEW";
        HR_INTERVIEW: "HR_INTERVIEW";
        SELECTED: "SELECTED";
        REJECTED: "REJECTED";
    }>;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type UpdateApplicationStatusData = z.infer<typeof UpdateApplicationStatusSchema>;
