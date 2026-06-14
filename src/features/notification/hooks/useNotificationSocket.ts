"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/src/shared/store/hooks";
import { useGlobalSocket } from "@/src/shared/context/socket-context";
import { notificationApi } from "../notificationApi";
import type { NotificationDto } from "../types";

/**
 * Hook that listens to `new_notification` events from the Notification Gateway.
 * Immediately updates RTK Query caches (notification list + unread count)
 * so UI reflects changes without polling.
 */
export function useNotificationSocket() {
  const { socket, isConnected } = useGlobalSocket();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewNotification = (notification: NotificationDto) => {
      // Prepend to notification list cache
      dispatch(
        notificationApi.util.updateQueryData(
          "getNotifications",
          { page: 1, limit: 20 },
          (draft) => {
            const exists = draft.data.find((n) => n.id === notification.id);
            if (!exists) {
              draft.data.unshift(notification);
              draft.meta.total += 1;
            }
          }
        )
      );

      // Increment unread count
      dispatch(
        notificationApi.util.updateQueryData(
          "getUnreadCount",
          undefined,
          (draft) => draft + 1
        )
      );
    };

    socket.on("new_notification", handleNewNotification);

    return () => {
      socket.off("new_notification", handleNewNotification);
    };
  }, [socket, isConnected, dispatch]);
}
