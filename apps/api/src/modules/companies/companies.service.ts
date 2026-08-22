import prisma from "../../lib/prisma";

export class CompaniesService {
  static async getAll() {
    return prisma.company.findMany({
      where: { isArchived: false },
      orderBy: { name: "asc" }
    });
  }

  static async getById(id: string) {
    const company = await prisma.company.findUnique({ where: { id } });
    if (!company) throw new Error("Company not found");
    return company;
  }

  static async create(data: { name: string, description?: string, industry?: string }) {
    return prisma.company.create({ data });
  }

  static async archive(id: string) {
    return prisma.company.update({
      where: { id },
      data: { isArchived: true }
    });
  }
}
