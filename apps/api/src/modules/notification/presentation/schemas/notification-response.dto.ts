import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';
import { NotificationType } from '../../../../shared/domain/enums/enums';

// ─── Response DTO ─────────────────────────────────────────────────────────

export const NotificationResponseSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    content: z.string().nullable().optional(),
    body: z.unknown().optional(),
    type: z.nativeEnum(NotificationType),
    isRead: z.boolean(),
    createdAt: z.string().datetime(),
    expiredAt: z.string().datetime().nullable().optional(),
  })
  .meta({ id: 'NotificationResponseDto' });

export class NotificationResponseDto extends createZodDto(
  NotificationResponseSchema,
) {
  static fromTarget(target: {
    notification: {
      id: string;
      title: string;
      content: string | null;
      body: unknown;
      type: NotificationType;
      createdAt: Date;
      expiredAt: Date | null;
    };
    isRead: boolean;
  }): NotificationResponseDto {
    const dto = new NotificationResponseDto();
    dto.id = target.notification.id;
    dto.title = target.notification.title;
    dto.content = target.notification.content ?? undefined;
    dto.body = target.notification.body ?? undefined;
    dto.type = target.notification.type;
    dto.isRead = target.isRead;
    dto.createdAt = target.notification.createdAt.toISOString();
    dto.expiredAt = target.notification.expiredAt?.toISOString() ?? undefined;
    return dto;
  }
}

// ─── Query params ─────────────────────────────────────────────────────────

export const GetNotificationsQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(20),
  })
  .meta({ id: 'GetNotificationsQueryDto' });

export class GetNotificationsQueryDto extends createZodDto(
  GetNotificationsQuerySchema,
) {}
