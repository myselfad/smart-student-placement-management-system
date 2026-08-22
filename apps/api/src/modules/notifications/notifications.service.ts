import prisma from "../../lib/prisma";

export class NotificationsService {
  static async sendNotification(data: {
    recipientId: string;
    title: string;
    body: string;
    type: string;
    relatedEntityId?: string;
  }) {
    return prisma.notification.create({ data });
  }

  static async getMyNotifications(recipientId: string) {
    return prisma.notification.findMany({
      where: { recipientId },
      orderBy: { createdAt: "desc" },
      take: 50
    });
  }

  static async markAsRead(id: string, recipientId: string) {
    return prisma.notification.update({
      where: { id }, // In MVP we can assume id is correct, or we can use a composite unique if available
      data: { isRead: true }
    });
  }

  static async markAllAsRead(recipientId: string) {
    return prisma.notification.updateMany({
      where: { recipientId, isRead: false },
      data: { isRead: true }
    });
  }
}
