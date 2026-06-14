import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';
import { CreateNotificationPayload } from '../../domain/notification.interfaces';
import { NotificationType } from '../../../../shared/domain/enums/enums';
import { $Enums, Prisma } from '../../../../../generated/prisma';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create notification in DB with targets.
   * Returns created notification for broadcasting.
   */
  async create(payload: CreateNotificationPayload) {
    const notification = await this.prisma.notification.create({
      data: {
        title: payload.title,
        content: payload.content,
        body: payload.body
          ? (payload.body as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        type: payload.type as unknown as $Enums.NotificationType,
        expiredAt: payload.expiredAt,
        targets: {
          create: payload.recipientIds.map((userId) => ({ userId })),
        },
      },
    });

    return notification;
  }

  /**
   * Get paginated notifications for a user (newest first, non-expired)
   */
  async getUserNotifications(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ) {
    const skip = (page - 1) * limit;
    const now = new Date();

    const notificationFilter = {
      OR: [
        { expiredAt: null },
        { expiredAt: { gt: now } },
      ] as Prisma.NotificationWhereInput[],
    };

    const where: Prisma.NotificationTargetWhereInput = {
      userId,
      notification: notificationFilter,
    };

    const [total, items] = await Promise.all([
      this.prisma.notificationTarget.count({ where }),
      this.prisma.notificationTarget.findMany({
        where,
        include: { notification: true },
        orderBy: { notification: { createdAt: 'desc' } },
        skip,
        take: limit,
      }),
    ]);

    return {
      data: items.map((t) => ({
        id: t.notification.id,
        title: t.notification.title,
        content: t.notification.content,
        body: t.notification.body,
        type: t.notification.type as unknown as NotificationType,
        isRead: t.isRead,
        createdAt: t.notification.createdAt,
        expiredAt: t.notification.expiredAt,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get unread count for a user
   */
  async getUnreadCount(userId: string): Promise<number> {
    const now = new Date();
    return this.prisma.notificationTarget.count({
      where: {
        userId,
        isRead: false,
        notification: {
          OR: [
            { expiredAt: null },
            { expiredAt: { gt: now } },
          ] as Prisma.NotificationWhereInput[],
        },
      },
    });
  }

  /**
   * Mark a single notification as read
   */
  async markRead(userId: string, notificationId: string): Promise<void> {
    await this.prisma.notificationTarget.updateMany({
      where: { userId, notificationId },
      data: { isRead: true },
    });
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllRead(userId: string): Promise<void> {
    await this.prisma.notificationTarget.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  /**
   * Delete a single notification for a user
   */
  async delete(userId: string, notificationId: string): Promise<void> {
    await this.prisma.notificationTarget.deleteMany({
      where: { userId, notificationId },
    });
  }

  /**
   * Delete all notifications for a user
   */
  async deleteAll(userId: string): Promise<void> {
    await this.prisma.notificationTarget.deleteMany({
      where: { userId },
    });
  }
}
