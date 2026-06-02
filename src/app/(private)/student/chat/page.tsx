import { ChatLayout } from "@/src/features/chat/components";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tin nhắn",
  description: "Cuộc trò chuyện với gia sư",
};

export default function StudentChatPage() {
  return (
    <div className="h-[calc(100vh-65px)] overflow-hidden">
      <ChatLayout />
    </div>
  );
}
