import prisma from "../../lib/prisma";

export class DashboardService {
  static async getStudentDashboard(userId: string) {
    const profile = await prisma.studentProfile.findUnique({ where: { userId } });
    
    if (!profile) return { activeApplications: 0, upcomingDeadlines: [] };

    // Get active applications
    const activeApplicationsCount = await prisma.application.count({
      where: {
        studentProfileId: profile.id,
        status: { notIn: ['REJECTED'] }
      }
    });

    // Get upcoming drives deadline
    const upcomingDeadlines = await prisma.placementDrive.findMany({
      where: {
        status: 'OPEN',
        applicationDeadline: { gt: new Date() }
      },
      orderBy: { applicationDeadline: 'asc' },
      take: 3,
      include: { company: true }
    });

    return {
      activeApplications: activeApplicationsCount,
      upcomingDeadlines
    };
  }

  static async getAdminDashboard() {
    const [totalStudents, totalDrives, totalApplications, totalOffers] = await Promise.all([
      prisma.studentProfile.count(),
      prisma.placementDrive.count(),
      prisma.application.count(),
      prisma.application.count({ where: { status: 'SELECTED' } })
    ]);

    // Group offers by branch (Analytics P1)
    const offersByBranchData = await prisma.application.findMany({
      where: { status: 'SELECTED' },
      include: { studentProfile: { select: { branch: true } } }
    });

    const branchCounts: Record<string, number> = {};
    for (const offer of offersByBranchData) {
      const branch = offer.studentProfile.branch || 'Unknown';
      branchCounts[branch] = (branchCounts[branch] || 0) + 1;
    }

    const offersByBranch = Object.entries(branchCounts).map(([branch, count]) => ({ branch, count }));

    return {
      metrics: {
        totalStudents,
        totalDrives,
        totalApplications,
        totalOffers
      },
      offersByBranch
    };
  }
}
