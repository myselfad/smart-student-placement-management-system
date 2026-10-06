import bcrypt from "bcryptjs";
import prisma from "../../lib/prisma";
import { RegisterStudentData, LoginData, InviteAdminData } from "shared-types";
import { Role } from "@prisma/client";
import { generateToken } from "../../utils/jwt";

export class AuthService {
  static async registerStudent(data: RegisterStudentData) {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new Error("Email already in use");
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        role: Role.STUDENT,
        studentProfile: {
          create: {
            fullName: data.fullName,
            profileCompletionPct: 20, // initial completion
          }
        }
      },
    });

    const token = generateToken({ id: user.id, role: user.role });
    return { 
      user: { id: user.id, email: user.email, role: user.role, name: data.fullName }, 
      token 
    };
  }

  static async login(data: LoginData) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: { studentProfile: true }
    });

    if (!user) throw new Error("Invalid email or password");
    if (!user.isActive) throw new Error("Account is disabled");

    const isValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValid) throw new Error("Invalid email or password");

    const token = generateToken({ id: user.id, role: user.role });
    const name = user.studentProfile?.fullName || user.name || user.email.split("@")[0];
    return { token, user: { id: user.id, email: user.email, role: user.role, name } };
  }

  static async inviteAdmin(data: InviteAdminData) {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new Error("Email already in use");
    }

    // Generate a random temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        role: data.role as Role,
      }
    });

    // In a real app, send email. For MVP, log it.
    console.log(`[Email Mock] Sent invite to ${user.email} with temp password: ${tempPassword}`);
    
    return { user: { id: user.id, email: user.email, role: user.role }, tempPassword };
  }
}
