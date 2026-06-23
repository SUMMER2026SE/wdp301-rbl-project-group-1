export interface ConversationResultData {
  id: string;
  type: string;
  name: string | null;
  avatarUrl: string | null;
  updatedAt: Date;
  lastMessage: {
    id: string;
    content: string;
    senderId: string | null;
    createdAt: Date;
  } | null;
  unreadCount: number;
  participants: {
    userId: string;
    nickname: string | null;
    avatarUrl: string | null;
  }[];
}
