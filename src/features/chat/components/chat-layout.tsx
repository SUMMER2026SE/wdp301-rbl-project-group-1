"use client";

import { MessageSquare, Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import { MOCK_CONVERSATION_DETAILS } from "../mock-data";
import type { ConversationFilter, ConversationDetail, Conversation, ConversationType } from "../types";
import { ChatInfoPanel } from "./chat-info-panel/chat-info-panel";
import { ChatWindow } from "./chat-window/chat-window";
import { ConversationSidebar } from "./conversation-sidebar/conversation-sidebar";
import { useGetConversationsQuery } from "../chatApi";

export function ChatLayout() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<ConversationFilter>("all");

  const { data: apiConversations, isLoading } = useGetConversationsQuery();

  // Map API response to UI Conversation type
  const mappedConversations: Conversation[] = useMemo(() => {
    if (!apiConversations) return [];
    return apiConversations.map((conv) => {
      const otherParticipant = conv.participants[0];
      return {
        id: conv.id,
        type: (conv.type.toLowerCase() === "direct" ? "personal" : "class") as ConversationType,
        name: conv.name || otherParticipant?.nickname || "Unknown User",
        avatar: conv.avatarUrl || otherParticipant?.avatarUrl || undefined,
        lastMessage: conv.lastMessage?.content || "Chưa có tin nhắn",
        lastMessageTime: conv.lastMessage ? new Date(conv.lastMessage.createdAt) : new Date(conv.updatedAt),
        unreadCount: conv.unreadCount,
        participant: otherParticipant ? {
          id: otherParticipant.id,
          name: otherParticipant.nickname || "Unknown",
          avatar: otherParticipant.avatarUrl || undefined,
          status: "offline", // Default until online status API is added
        } : undefined,
      };
    });
  }, [apiConversations]);

  const activeId = selectedId || (mappedConversations.length > 0 ? mappedConversations[0].id : null);

  const filteredConversations = mappedConversations.filter((conv) => {
    if (activeFilter === "class") return conv.type === "class";
    if (activeFilter === "personal") return conv.type === "personal";
    return true;
  });

  const selectedConv = mappedConversations.find(c => c.id === activeId);

  // Fallback to mock data for detail features (documents, sessions)
  // while utilizing actual conversation details
  const selectedDetail: ConversationDetail | null = selectedConv
    ? {
        ...selectedConv,
        messages: [], // Real messages handled by ChatWindow
        sharedDocuments: MOCK_CONVERSATION_DETAILS["conv-1"]?.sharedDocuments || [],
        upcomingSession: MOCK_CONVERSATION_DETAILS["conv-1"]?.upcomingSession,
      }
    : null;

  return (
    <div className="flex h-full bg-background overflow-hidden">
      {isLoading ? (
        <div className="w-80 flex items-center justify-center border-r border-border">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <ConversationSidebar
          conversations={filteredConversations}
          selectedId={activeId}
          activeFilter={activeFilter}
          onSelectConversation={setSelectedId}
          onFilterChange={setActiveFilter}
        />
      )}

      {selectedDetail ? (
        <>
          <ChatWindow detail={selectedDetail} />
          <ChatInfoPanel detail={selectedDetail} />
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground">
          <MessageSquare className="size-12 opacity-30" />
          <p className="text-sm">Chọn một cuộc trò chuyện để bắt đầu</p>
        </div>
      )}
    </div>
  );
}
