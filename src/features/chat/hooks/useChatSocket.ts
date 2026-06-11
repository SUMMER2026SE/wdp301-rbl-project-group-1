import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useGlobalSocket } from "@/src/shared/context/socket-context";
import { Message, MessageType } from "../types";

interface RootState {
  auth?: {
    user?: {
      id: string;
    };
  };
}

export const useChatSocket = (conversationId?: string) => {
  const { socket, isConnected, error } = useGlobalSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const currentUserId = useSelector((state: RootState) => state.auth?.user?.id);

  useEffect(() => {
    if (!socket || !isConnected || !conversationId) return;

    // Join the room once connected
    socket.emit("join_conversation", { conversationId });

    socket.on("conversation_history", (history: { id: string; content: string; senderId?: string; sender?: { id: string; nickname: string; avatarUrl?: string }; createdAt?: string; type?: string }[]) => {
      // Map backend data to frontend UI data
      const mappedMessages: Message[] = history.reverse().map((msg) => ({
        id: msg.id,
        content: msg.content,
        senderId: msg.senderId || msg.sender?.id || "unknown",
        senderName: msg.sender?.nickname || "Unknown",
        senderAvatar: msg.sender?.avatarUrl,
        timestamp: new Date(msg.createdAt || Date.now()),
        type: (msg.type?.toLowerCase() as MessageType) || "text",
        isOwn: (msg.senderId || msg.sender?.id) === currentUserId,
      }));
      setMessages(mappedMessages);
    });

    socket.on("new_message", (msg: { id: string; content: string; senderId?: string; sender?: { id: string; nickname: string; avatarUrl?: string }; createdAt?: string; type?: string }) => {
      const newMsg: Message = {
        id: msg.id,
        content: msg.content,
        senderId: msg.senderId || msg.sender?.id || "unknown",
        senderName: msg.sender?.nickname || "Unknown",
        senderAvatar: msg.sender?.avatarUrl,
        timestamp: new Date(msg.createdAt || Date.now()),
        type: (msg.type?.toLowerCase() as MessageType) || "text",
        isOwn: (msg.senderId || msg.sender?.id) === currentUserId,
      };
      setMessages((prev) => [...prev, newMsg]);
    });

    return () => {
      socket.off("conversation_history");
      socket.off("new_message");
    };
  }, [socket, isConnected, conversationId, currentUserId]);

  const sendMessage = useCallback(
    (content: string, type: string = "TEXT") => {
      if (socket && isConnected) {
        socket.emit("send_message", {
          conversationId,
          content,
          type,
        });
      }
    },
    [conversationId, isConnected, socket]
  );

  return {
    messages,
    isConnected,
    error,
    sendMessage,
  };
};
