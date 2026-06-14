export type ConversationType = "class" | "personal";
export type MessageType = "text" | "file";
export type AttachmentType = "pdf" | "image" | "other";
export type UserStatus = "online" | "offline" | "away" | "busy";
export type ConversationFilter = "all" | "class" | "personal";

export interface MessageAttachment {
  id: string;
  name: string;
  size: number; // bytes
  url: string;
  type: AttachmentType;
}

export interface Message {
  id: string;
  content?: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: Date;
  attachments?: MessageAttachment[];
  type: MessageType;
  isOwn: boolean;
}

export interface ConversationParticipant {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
  status: UserStatus;
}

export interface Conversation {
  id: string;
  type: ConversationType;
  name: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount?: number;
  participant?: ConversationParticipant;
}

export interface SharedDocument {
  id: string;
  name: string;
  size: number; // bytes
  type: AttachmentType;
  url: string;
  sharedAt: Date;
}

export interface UpcomingSession {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  topic: string;
}

export interface ConversationDetail extends Conversation {
  messages: Message[];
  sharedDocuments: SharedDocument[];
  upcomingSession?: UpcomingSession;
}

// --- API Response DTOs ---

export interface UserBasicDto {
  id: string;
  nickname: string | null;
  avatarUrl: string | null;
}

export type ConversationParticipantDto = UserBasicDto;

export interface MessageResponseDto {
  id: string;
  conversationId: string;
  senderId: string | null;
  content: string;
  type: string;
  fileUrl: string | null;
  replyToId: string | null;
  isDeleted: boolean;
  createdAt: string;
  sender: UserBasicDto | null;
}

export interface ConversationResponseDto {
  id: string;
  type: string;
  name: string | null;
  avatarUrl: string | null;
  updatedAt: string;
  lastMessage: {
    id: string;
    content: string;
    senderId: string | null;
    createdAt: string;
  } | null;
  unreadCount: number;
  participants: ConversationParticipantDto[];
}

export interface CreateConversationDto {
  targetUserId: string;
}

export interface MarkReadDto {
  lastMessageId: string;
}

export interface GetMessagesParams {
  conversationId: string;
  page?: number;
  limit?: number;
}
