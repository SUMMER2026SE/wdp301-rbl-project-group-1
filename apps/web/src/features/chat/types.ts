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
