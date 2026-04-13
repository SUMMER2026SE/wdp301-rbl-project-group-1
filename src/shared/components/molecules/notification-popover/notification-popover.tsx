"use client";

import { Button } from "@/src/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/shared/components/ui/popover";
import { Bell } from "lucide-react";
import { useState } from "react";

interface Notification {
  id: string;
  title: string;
  description: string;
  icon: string;
  time: string;
  read: boolean;
}

const notifications: Notification[] = [
  {
    id: "1",
    title: "Có Phạm Thu Thủy đã xác nhận buổi học",
    time: "2 phút trước",
    icon: "task_alt",
    description: "",
    read: false,
  },
  {
    id: "2",
    title: "Thầy Lê Hoàng đã gửi cho bạn một tin nhắn",
    time: "1 giờ trước",
    icon: "mail",
    description: "",
    read: false,
  },
  {
    id: "3",
    title: "Cập nhật hệ thống: Tính năng phòng bình luận",
    time: "Hôm qua",
    icon: "info",
    description: "",
    read: true,
  },
  {
    id: "4",
    title: "Thanh toán thành công khóa học Toán lớp 12",
    time: "2 ngày trước",
    icon: "check_circle",
    description: "",
    read: true,
  },
];

export function NotificationPopover() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground"
        >
          <Bell className="size-5" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-80 p-0 bg-popover text-popover-foreground"
        align="end"
      >
        <div className="flex flex-col">
          <div className="border-b border-border px-4 py-3">
            <h3 className="font-semibold text-foreground">Thông báo</h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="border-b border-border px-4 py-3"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 shrink-0">
                    {notification.icon === "task_alt" && (
                      <span className="material-symbols-outlined text-lg text-primary">
                        task_alt
                      </span>
                    )}
                    {notification.icon === "mail" && (
                      <span className="material-symbols-outlined text-lg text-primary">
                        mail
                      </span>
                    )}
                    {notification.icon === "info" && (
                      <span className="material-symbols-outlined text-lg text-primary">
                        info
                      </span>
                    )}
                    {notification.icon === "check_circle" && (
                      <span className="material-symbols-outlined text-lg text-primary">
                        check_circle
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-2">
                      {notification.title}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {notification.time}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="mt-1 size-2 shrink-0 rounded-full bg-primary"></div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border px-4 py-3">
            <Button
              variant="ghost"
              className="w-full text-primary"
              onClick={() => setIsOpen(false)}
            >
              Xem tất cả thông báo
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
