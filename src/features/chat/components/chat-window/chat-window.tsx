import type { ConversationDetail } from "../../types";
import { ChatHeader } from "./chat-header";
import { ChatInputBar } from "./chat-input-bar";
import { MessagesArea } from "./messages-area";
import { useChatSocket } from "../../hooks/useChatSocket";

interface ChatWindowProps {
  detail: ConversationDetail;
}

export function ChatWindow({ detail }: ChatWindowProps) {
  const { messages, sendMessage } = useChatSocket(detail.id);

  // We merge local detail.messages with realtime messages from socket
  // Or better, just use socket messages if we fetch history through socket.
  // The hook fetches history when joining, so `messages` has all of it.
  
  return (
    <div className="flex-1 flex flex-col min-w-0 border-r border-border">
      <ChatHeader conversation={detail} />
      <MessagesArea messages={messages.length > 0 ? messages : detail.messages} />
      <ChatInputBar onSendMessage={sendMessage} />
    </div>
  );
}
