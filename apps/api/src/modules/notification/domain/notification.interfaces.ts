import { NotificationType } from '../../../shared/domain/enums/enums';

export interface CreateNotificationPayload {
  title: string;
  content?: string;
  body?: Record<string, unknown>; // e.g. { conversationId, bookingId }
  type: NotificationType;
  recipientIds: string[]; // Array of user IDs to notify
  expiredAt?: Date;
}
