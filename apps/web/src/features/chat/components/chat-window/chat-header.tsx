import { Avatar } from "@/src/shared/components/atoms/avatar/avatar";
import { Button } from "@/src/shared/components/ui/button";
import { Info, Phone, Video } from "lucide-react";
import type { Conversation } from "../../types";

interface ChatHeaderProps {
  conversation: Conversation;
}

export function ChatHeader({ conversation }: ChatHeaderProps) {
  const isOnline = conversation.participant?.status === "online";

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background shrink-0">
      <div className="flex items-center gap-3">
        {conversation.type === "class" ? (
          <div className="size-10 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-bold shrink-0">
            {conversation.name.slice(0, 3)}
          </div>
        ) : (
          <Avatar
            src={conversation.avatar}
            fallback={conversation.name}
            size="md"
            status={conversation.participant?.status ?? "offline"}
            showStatus={isOnline}
          />
        )}
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            {conversation.name}
          </h2>
          {isOnline ? (
            <p className="text-xs text-success">Đang trực tuyến</p>
          ) : (
            <p className="text-xs text-muted-foreground">Ngoại tuyến</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
        >
          <Phone className="size-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
        >
          <Video className="size-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
        >
          <Info className="size-5" />
        </Button>
      </div>
    </div>
  );
}
