import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const superAdminEmail = "admin@sspms.edu";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: superAdminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("SuperSecret123!", 10);
    await prisma.user.create({
      data: {
        email: superAdminEmail,
        passwordHash,
        role: Role.SUPER_ADMIN,
        isActive: true,
      },
    });
    console.log(`Created Super Admin account: ${superAdminEmail}`);
  } else {
    console.log(`Super Admin account already exists: ${superAdminEmail}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
