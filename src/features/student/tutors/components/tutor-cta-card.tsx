"use client";

import { Button } from "@/src/shared/components/ui/button";

interface TutorCTACardProps {
  price: number;
  onBookLesson?: () => void;
  onContactChat?: () => void;
}

export function TutorCTACard({
  price,
  onBookLesson,
  onContactChat,
}: TutorCTACardProps) {
  return (
    <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 shadow-sm">
      <div className="mb-4">
        <div className="text-3xl font-bold text-primary mb-2">
          {price.toLocaleString("vi-VN")}đ
        </div>
        <p className="text-sm text-muted-foreground">/giờ</p>
      </div>
      <Button
        onClick={onBookLesson}
        className="w-full bg-primary hover:bg-primary/90 mb-3"
      >
        Đặt lịch học ngay
      </Button>
      <Button variant="outline" onClick={onContactChat} className="w-full">
        Liên hệ qua chat
      </Button>
    </div>
  );
}
