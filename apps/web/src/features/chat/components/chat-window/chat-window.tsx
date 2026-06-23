import { useMemo, useEffect } from "react";
import type { ConversationDetail, Message, MessageType } from "../../types";
import { ChatHeader } from "./chat-header";
import { ChatInputBar } from "./chat-input-bar";
import { MessagesArea } from "./messages-area";
import { useChatSocket } from "../../hooks/useChatSocket";
import { useGetConversationMessagesQuery, useSendMessageMutation } from "../../chatApi";
import { Loader2 } from "lucide-react";
import { useGetMeQuery } from "@/src/features/auth/authApi";

interface ChatWindowProps {
  detail: ConversationDetail;
}

export function ChatWindow({ detail }: ChatWindowProps) {
  const { data: me } = useGetMeQuery();
  const currentUserId = me?.data?.id;
  const { markRead, typingUsers } = useChatSocket(detail.id);
  const { data: apiMessagesRes, isLoading } = useGetConversationMessagesQuery({
    conversationId: detail.id,
    page: 1,
    limit: 50,
  });
  const [sendMessageApi] = useSendMessageMutation();

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    try {
      await sendMessageApi({
        conversationId: detail.id,
        content: content.trim(),
        type: "TEXT",
      }).unwrap();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Map API messages to UI Message type
  const mappedMessages: Message[] = useMemo(() => {
    if (!apiMessagesRes) return [];
    // API returns messages descending (newest first). 
    // Usually chat UIs render ascending (oldest first).
    // Let's reverse them for the UI rendering if needed, 
    // or assume MessagesArea handles descending rendering.
    // Assuming MessagesArea renders them from top to bottom, we need to reverse.
    const sorted = [...apiMessagesRes.data].reverse();
    return sorted.map((msg) => ({
      id: msg.id,
      content: msg.content,
      senderId: msg.senderId || msg.sender?.id || "unknown",
      senderName: msg.sender?.nickname || "Unknown",
      senderAvatar: msg.sender?.avatarUrl || undefined,
      timestamp: new Date(msg.createdAt),
      type: (msg.type?.toLowerCase() as MessageType) || "text",
      isOwn: (msg.senderId || msg.sender?.id) === currentUserId || msg.senderId === "me",
    }));
  }, [apiMessagesRes, currentUserId]);

  // Mark as read when messages load and there are new ones
  useEffect(() => {
    if (mappedMessages.length > 0) {
      const lastMsg = mappedMessages[mappedMessages.length - 1];
      if (!lastMsg.isOwn) {
        markRead(lastMsg.id);
      }
    }
  }, [mappedMessages, markRead]);

  return (
    <div className="flex-1 flex flex-col min-w-0 border-r border-border">
      <ChatHeader conversation={detail} />
      
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <MessagesArea messages={mappedMessages} />
      )}
      
      {/* Show typing indicator */}
      {typingUsers.length > 0 && (
        <div className="px-6 py-2 text-xs text-muted-foreground italic">
          {detail.participant?.name || "User"} đang soạn tin...
        </div>
      )}

      <ChatInputBar 
        onSendMessage={handleSendMessage}
        // If ChatInputBar supports typing events, we can pass them here:
        // onTyping={sendTyping} 
        // onStopTyping={sendStopTyping}
      />
    </div>
  );
}
