"use client";

import { useRouter, usePathname } from "next/navigation";

import { Button } from "@/src/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/shared/components/ui/popover";
import { Bell, CheckCircle, CheckCircle2, Info, Mail, MessageSquare, Calendar, CreditCard, Star, AlertCircle, X, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
  useClearAllNotificationsMutation,
} from "@/src/features/notification/notificationApi";
import { useNotificationSocket } from "@/src/features/notification/hooks/useNotificationSocket";
import type { NotificationDto } from "@/src/features/notification/types";

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "CHAT":
      return <MessageSquare className="size-5 text-blue-500" />;
    case "BOOKING":
      return <Calendar className="size-5 text-green-500" />;
    case "PAYMENT":
      return <CreditCard className="size-5 text-purple-500" />;
    case "REVIEW":
      return <Star className="size-5 text-yellow-500" />;
    case "SYSTEM":
      return <Info className="size-5 text-primary" />;
    default:
      return <AlertCircle className="size-5 text-muted-foreground" />;
  }
};

export function NotificationPopover() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Register socket listener
  useNotificationSocket();

  const { data: unreadCount = 0 } = useGetUnreadCountQuery(undefined, {
    pollingInterval: 60_000,
  });

  const { data: notificationsRes, isLoading } = useGetNotificationsQuery(
    { page: 1, limit: 20 },
    { skip: !isOpen }
  );

  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead, { isLoading: isMarkingAll }] = useMarkAllNotificationsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [clearAllNotifications, { isLoading: isClearingAll }] = useClearAllNotificationsMutation();

  const notifications = notificationsRes?.data ?? [];

  const handleNotificationClick = (notification: NotificationDto) => {
    if (!notification.isRead) {
      markRead(notification.id);
    }
    setIsOpen(false);

    // Determine the base path based on the current URL
    const basePath = pathname.startsWith("/tutor") ? "/tutor" : "/student";

    switch (notification.type) {
      case "CHAT":
        if (notification.body?.conversationId) {
          router.push(`${basePath}/chat?conversationId=${notification.body.conversationId}`);
        }
        break;
      case "BOOKING":
        if (notification.body?.bookingId) {
          router.push(`${basePath}/bookings/${notification.body.bookingId}`);
        }
        break;
      case "PAYMENT":
        router.push(`${basePath}/transactions`);
        break;
      default:
        break;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground"
        >
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-80 p-0 bg-popover text-popover-foreground"
        align="end"
      >
        <div className="flex flex-col">
          <div className="border-b border-border px-4 py-3 flex justify-between items-center">
            <h3 className="font-semibold text-foreground">
              Thông báo
              {unreadCount > 0 && (
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  ({unreadCount} chưa đọc)
                </span>
              )}
            </h3>
            <div className="flex gap-2">
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs text-muted-foreground hover:bg-transparent hover:underline"
                  onClick={() => void clearAllNotifications()}
                  disabled={isClearingAll}
                >
                  Xóa tất cả
                </Button>
              )}
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs text-primary hover:bg-transparent hover:underline"
                  onClick={() => void markAllRead()}
                  disabled={isMarkingAll}
                >
                  Đọc tất cả
                </Button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Đang tải...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 flex flex-col items-center text-center">
                <Bell className="size-8 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">Không có thông báo nào</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border-b border-border px-4 py-3 cursor-pointer transition-colors hover:bg-muted/50 ${
                    !notification.isRead ? "bg-primary/5" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm line-clamp-2 ${!notification.isRead ? "font-semibold text-foreground" : "font-medium text-muted-foreground"}`}>
                        {notification.title}
                      </p>
                      {notification.content && (
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                          {notification.content}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-muted-foreground/70">
                        {new Date(notification.createdAt).toLocaleString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="flex flex-col items-end shrink-0 gap-1 mt-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          void deleteNotification(notification.id);
                        }}
                      >
                        <X className="size-4" />
                      </Button>
                      {!notification.isRead && (
                        <div className="size-2 rounded-full bg-primary" />
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

