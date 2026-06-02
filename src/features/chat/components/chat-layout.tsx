"use client";

import { MessageSquare } from "lucide-react";
import { useState } from "react";
import { MOCK_CONVERSATIONS, MOCK_CONVERSATION_DETAILS } from "../mock-data";
import type { ConversationFilter } from "../types";
import { ChatInfoPanel } from "./chat-info-panel/chat-info-panel";
import { ChatWindow } from "./chat-window/chat-window";
import { ConversationSidebar } from "./conversation-sidebar/conversation-sidebar";

export function ChatLayout() {
  const [selectedId, setSelectedId] = useState<string | null>("conv-1");
  const [activeFilter, setActiveFilter] = useState<ConversationFilter>("all");

  const filteredConversations = MOCK_CONVERSATIONS.filter((conv) => {
    if (activeFilter === "class") return conv.type === "class";
    if (activeFilter === "personal") return conv.type === "personal";
    return true;
  });

  const selectedDetail = selectedId
    ? MOCK_CONVERSATION_DETAILS[selectedId]
    : null;

  return (
    <div className="flex h-full bg-background overflow-hidden">
      <ConversationSidebar
        conversations={filteredConversations}
        selectedId={selectedId}
        activeFilter={activeFilter}
        onSelectConversation={setSelectedId}
        onFilterChange={setActiveFilter}
      />

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
