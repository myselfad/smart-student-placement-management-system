import prisma from "../../lib/prisma";
import { CreateAnnouncementData } from "shared-types";

export class AnnouncementsService {
  static async list() {
    const items = await prisma.announcement.findMany({
      include: { createdBy: { select: { email: true, name: true, role: true } } },
      orderBy: { createdAt: "desc" },
    });
    return items.map((a) => ({ ...a, audience: safeParse(a.audienceFilter) }));
  }

  static async create(userId: string, data: CreateAnnouncementData) {
    const audience = { branch: data.branch || null, graduationYear: data.graduationYear || null };

    const announcement = await prisma.announcement.create({
      data: {
        title: data.title,
        body: data.body,
        audienceFilter: JSON.stringify(audience),
        createdByUserId: userId,
      },
    });

    const recipients = await prisma.studentProfile.findMany({
      where: {
        ...(audience.branch ? { branch: audience.branch } : {}),
        ...(audience.graduationYear ? { graduationYear: audience.graduationYear } : {}),
        user: { isActive: true },
      },
      select: { userId: true },
    });

    if (recipients.length > 0) {
      await prisma.notification.createMany({
        data: recipients.map((r) => ({
          recipientId: r.userId,
          type: "ANNOUNCEMENT",
          title: data.title,
          body: data.body,
          relatedEntityType: "ANNOUNCEMENT",
          relatedEntityId: announcement.id,
        })),
      });
    }

    return { ...announcement, audience, recipientCount: recipients.length };
  }
}

function safeParse(s: string) {
  try { return JSON.parse(s); } catch { return {}; }
}
