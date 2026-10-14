import bcrypt from "bcryptjs";
import prisma from "../../lib/prisma";
import { RegisterStudentData, LoginData, InviteAdminData } from "shared-types";
import { Role } from "@prisma/client";
import { generateToken } from "../../utils/jwt";

export class AuthService {
  static async registerStudent(data: RegisterStudentData) {
    const email = data.email.trim().toLowerCase();
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error("Email already in use");
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: Role.STUDENT,
        studentProfile: {
          create: {
            fullName: data.fullName.trim(),
            profileCompletionPct: 20, // initial completion
          },
        },
      },
    });

    const token = generateToken({ id: user.id, role: user.role });
    return {
      user: { id: user.id, email: user.email, role: user.role, name: data.fullName.trim() },
      token,
    };
  }

  static async login(data: LoginData) {
    const email = data.email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email },
      include: { studentProfile: true },
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
    const email = data.email.trim().toLowerCase();
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error("Email already in use");
    }

    // Generate a random temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: data.role as Role,
      },
    });

    return { user: { id: user.id, email: user.email, role: user.role }, tempPassword };
  }
}
