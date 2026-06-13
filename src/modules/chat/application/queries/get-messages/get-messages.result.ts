export interface MessageResultData {
  id: string;
  conversationId: string;
  senderId: string | null;
  content: string;
  type: string;
  fileUrl: string | null;
  replyToId: string | null;
  isDeleted: boolean;
  createdAt: Date;
  sender: {
    id: string;
    nickname: string | null;
    avatarUrl: string | null;
  } | null;
}
