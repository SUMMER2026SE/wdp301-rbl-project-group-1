// ─── Notification Types ───────────────────────────────────────────────────

export type NotificationType =
  | 'SYSTEM'
  | 'FORUM'
  | 'BOOKING'
  | 'CHAT'
  | 'PAYMENT'
  | 'REVIEW';

export interface NotificationDto {
  id: string;
  title: string;
  content?: string | null;
  /** Arbitrary payload for routing (e.g. { conversationId, bookingId }) */
  body?: Record<string, unknown> | null;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  expiredAt?: string | null;
}

export interface NotificationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface NotificationListResponse {
  success: boolean;
  message: string;
  data: NotificationDto[];
  meta: NotificationMeta;
}
