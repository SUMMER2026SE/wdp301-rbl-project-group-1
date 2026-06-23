import { useEffect, useCallback, useState } from "react";
import { useAppDispatch } from "@/src/shared/store/hooks";
import { useGlobalSocket } from "@/src/shared/context/socket-context";
import { chatApi } from "../chatApi";
import { MessageResponseDto } from "../types";
import { useGetMeQuery } from "@/src/features/auth/authApi";

export const useChatSocket = (conversationId?: string) => {
  const { socket, isConnected, error } = useGlobalSocket();
  const dispatch = useAppDispatch();
  const { data: me } = useGetMeQuery();
  const currentUserId = me?.data?.id;
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!socket || !isConnected || !conversationId) return;

    socket.emit("join_conversation", { conversationId });

    const handleNewMessage = (msg: MessageResponseDto) => {
      // Optimistically update RTK Query cache for this conversation
      // The backend returns messages sorted desc by createdAt, so unshift is appropriate if we want newest first
      // But typically UI renders bottom-up. Let's just push it to the beginning of the `data` array.
      dispatch(
        chatApi.util.updateQueryData(
          "getConversationMessages",
          { conversationId, page: 1, limit: 50 },
          (draft) => {
            // Check if the message is already in the list to avoid duplication
            if (!draft.data.find((m) => m.id === msg.id)) {
              if (msg.senderId === currentUserId) {
                // To avoid flicker from optimistic UI, replace the oldest temp message
                let tempIndex = -1;
                for (let i = draft.data.length - 1; i >= 0; i--) {
                  if (draft.data[i].id.startsWith("temp-")) {
                    tempIndex = i;
                    break;
                  }
                }
                if (tempIndex !== -1) {
                  draft.data[tempIndex] = msg;
                } else {
                  draft.data.unshift(msg);
                }
              } else {
                draft.data.unshift(msg);
              }
            }
          }
        )
      );

      // Also update the lastMessage in getConversations cache
      dispatch(
        chatApi.util.updateQueryData("getConversations", undefined, (draft) => {
          const conv = draft.find((c) => c.id === conversationId);
          if (conv) {
            conv.lastMessage = {
              id: msg.id,
              content: msg.content,
              senderId: msg.senderId,
              createdAt: msg.createdAt,
            };
            conv.updatedAt = msg.createdAt;
          }
        })
      );
    };

    const handleUserTyping = ({ userId }: { userId: string }) => {
      if (userId !== currentUserId) {
        setTypingUsers((prev) =>
          prev.includes(userId) ? prev : [...prev, userId]
        );
      }
    };

    const handleUserStopTyping = ({ userId }: { userId: string }) => {
      setTypingUsers((prev) => prev.filter((id) => id !== userId));
    };

    const handleMessageRead = () => {
      // We could update the message read status in the cache here
    };

    socket.on("new_message", handleNewMessage);
    socket.on("user_typing", handleUserTyping);
    socket.on("user_stop_typing", handleUserStopTyping);
    socket.on("message_read", handleMessageRead);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("user_typing", handleUserTyping);
      socket.off("user_stop_typing", handleUserStopTyping);
      socket.off("message_read", handleMessageRead);
      socket.emit("leave_conversation", { conversationId });
      setTypingUsers([]);
    };
  }, [socket, isConnected, conversationId, dispatch, currentUserId]);

  const sendMessage = useCallback(
    (content: string, type: string = "TEXT") => {
      if (socket && isConnected && conversationId) {
        socket.emit("send_message", {
          conversationId,
          content,
          type,
        });
      }
    },
    [conversationId, isConnected, socket]
  );

  const markRead = useCallback(
    (lastMessageId: string) => {
      if (socket && isConnected && conversationId) {
        socket.emit("mark_read", { conversationId, lastMessageId });
      }
    },
    [conversationId, isConnected, socket]
  );

  const sendTyping = useCallback(() => {
    if (socket && isConnected && conversationId) {
      socket.emit("typing", { conversationId });
    }
  }, [conversationId, isConnected, socket]);

  const sendStopTyping = useCallback(() => {
    if (socket && isConnected && conversationId) {
      socket.emit("stop_typing", { conversationId });
    }
  }, [conversationId, isConnected, socket]);

  return {
    isConnected,
    error,
    typingUsers,
    sendMessage,
    markRead,
    sendTyping,
    sendStopTyping,
  };
};
