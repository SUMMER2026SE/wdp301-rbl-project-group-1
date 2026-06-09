import type { ConversationDetail } from "../../types";
import { ChatHeader } from "./chat-header";
import { ChatInputBar } from "./chat-input-bar";
import { MessagesArea } from "./messages-area";

interface ChatWindowProps {
  detail: ConversationDetail;
}

export function ChatWindow({ detail }: ChatWindowProps) {
  return (
    <div className="flex-1 flex flex-col min-w-0 border-r border-border">
      <ChatHeader conversation={detail} />
      <MessagesArea messages={detail.messages} />
      <ChatInputBar />
    </div>
  );
}
