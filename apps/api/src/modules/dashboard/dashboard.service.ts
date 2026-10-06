import prisma from "../../lib/prisma";
import { ApplicationStatus } from "@prisma/client";

export class DashboardService {
  static async getStudentDashboard(userId: string) {
    const profile = await prisma.studentProfile.findUnique({ where: { userId } });
    
    if (!profile) return { activeApplications: 0, upcomingDeadlines: [] };

    const activeApplicationsCount = await prisma.application.count({
      where: {
        studentProfileId: profile.id,
        status: { notIn: ['REJECTED'] }
      }
    });

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
      prisma.placementDrive.count({ where: { status: 'OPEN' } }),
      prisma.application.count(),
      prisma.application.count({ where: { status: 'SELECTED' } })
    ]);

    // Group offers by branch
    const offersByBranchData = await prisma.application.findMany({
      where: { status: 'SELECTED' },
      include: { studentProfile: { select: { branch: true } } }
    });
    const branchCounts: Record<string, number> = {};
    for (const offer of offersByBranchData) {
      const branch = offer.studentProfile.branch || 'Unknown';
      branchCounts[branch] = (branchCounts[branch] || 0) + 1;
    }
    const offersByBranch = Object.entries(branchCounts).map(([branch, count]) => ({ name: branch, count }));

    // Group applications by status
    const allApps = await prisma.application.findMany({
      select: { status: true }
    });
    const statusCounts: Record<string, number> = {
      APPLIED: 0,
      SHORTLISTED: 0,
      TECHNICAL_INTERVIEW: 0,
      SELECTED: 0,
      REJECTED: 0
    };
    for (const app of allApps) {
      if (statusCounts[app.status] !== undefined) {
        statusCounts[app.status]++;
      } else {
        statusCounts[app.status] = 1;
      }
    }
    const applicationsByStatus = Object.entries(statusCounts).map(([status, count]) => ({
      name: status.replace('_', ' '),
      count
    }));

    // Group by company
    const appsByDrive = await prisma.application.findMany({
      include: {
        drive: {
          include: { company: true }
        }
      }
    });
    const companyCounts: Record<string, number> = {};
    for (const app of appsByDrive) {
      const company = app.drive.company.name;
      companyCounts[company] = (companyCounts[company] || 0) + 1;
    }
    const applicationsByCompany = Object.entries(companyCounts).map(([company, count]) => ({
      name: company,
      count
    })).sort((a, b) => b.count - a.count).slice(0, 5); // top 5 companies

    return {
      metrics: {
        totalStudents,
        totalDrives,
        totalApplications,
        totalOffers,
        placementPercentage: totalStudents > 0 ? Math.round((totalOffers / totalStudents) * 100) : 0
      },
      offersByBranch,
      applicationsByStatus,
      applicationsByCompany
    };
  }
}
