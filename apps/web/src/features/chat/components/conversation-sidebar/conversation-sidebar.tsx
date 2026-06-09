"use client";

import { SearchBox } from "@/src/shared/components/molecules/search-box/search-box";
import { cn } from "@/src/shared/lib/utils";
import { useState } from "react";
import type { Conversation, ConversationFilter } from "../../types";
import { ConversationItem } from "./conversation-item";

interface ConversationSidebarProps {
  conversations: Conversation[];
  selectedId: string | null;
  activeFilter: ConversationFilter;
  onSelectConversation: (id: string) => void;
  onFilterChange: (filter: ConversationFilter) => void;
}

const FILTER_TABS: { label: string; value: ConversationFilter }[] = [
  { label: "Tất cả", value: "all" },
  { label: "Lớp học", value: "class" },
  { label: "Cá nhân", value: "personal" },
];

export function ConversationSidebar({
  conversations,
  selectedId,
  activeFilter,
  onSelectConversation,
  onFilterChange,
}: ConversationSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-72 flex flex-col border-r border-border bg-background shrink-0">
      {/* Search */}
      <div className="p-4 pb-3">
        <SearchBox
          placeholder="Tìm kiếm tin nhắn..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filter tabs */}
      <div className="px-4 pb-3 flex gap-2">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onFilterChange(tab.value)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
              activeFilter === tab.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-10">
            Không tìm thấy cuộc trò chuyện
          </p>
        ) : (
          filtered.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isSelected={conv.id === selectedId}
              onClick={() => onSelectConversation(conv.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
