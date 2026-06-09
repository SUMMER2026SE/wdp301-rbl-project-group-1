import { Avatar } from "@/src/shared/components/atoms/avatar/avatar";
import { cn } from "@/src/shared/lib/utils";
import type { Conversation } from "../../types";

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

function formatConvTime(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const convDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (convDay.getTime() === today.getTime()) {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  if (convDay.getTime() === yesterday.getTime()) {
    return "Hôm qua";
  }
  const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  return days[date.getDay()];
}

export function ConversationItem({
  conversation,
  isSelected,
  onClick,
}: ConversationItemProps) {
  const participantStatus = conversation.participant?.status;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/60 transition-colors text-left border-l-2",
        isSelected ? "bg-primary/8 border-l-primary" : "border-l-transparent",
      )}
    >
      {conversation.type === "class" ? (
        <div className="size-10 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-bold shrink-0">
          {conversation.name.slice(0, 3)}
        </div>
      ) : (
        <Avatar
          src={conversation.avatar}
          fallback={conversation.name}
          size="md"
          status={participantStatus ?? "offline"}
          showStatus={participantStatus === "online"}
        />
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span
            className={cn(
              "text-sm font-medium truncate",
              isSelected ? "text-primary" : "text-foreground",
            )}
          >
            {conversation.name}
          </span>
          <span className="text-xs text-muted-foreground shrink-0">
            {formatConvTime(conversation.lastMessageTime)}
          </span>
        </div>
        <p
          className={cn(
            "text-xs truncate mt-0.5",
            isSelected ? "text-primary/70" : "text-muted-foreground",
          )}
        >
          {conversation.lastMessage}
        </p>
      </div>

      {conversation.unreadCount && conversation.unreadCount > 0 ? (
        <span className="size-5 rounded-full bg-primary text-primary-foreground text-[10px] font-medium flex items-center justify-center shrink-0">
          {conversation.unreadCount}
        </span>
      ) : null}
    </button>
  );
}
