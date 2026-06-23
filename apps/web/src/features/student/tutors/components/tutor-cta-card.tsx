"use client";

import { Button } from "@/src/shared/components/ui/button";
import { BookingModal } from "@/src/features/booking/components";
import { Loader2 } from "lucide-react";

interface TutorCTACardProps {
  tutorId: string;
  tutorName?: string;
  price: number;
  tutorAvailableSlots?: Record<string, boolean>;
  onContactChat?: () => void;
  isContacting?: boolean;
}

export function TutorCTACard({
  tutorId,
  tutorName,
  price,
  tutorAvailableSlots,
  onContactChat,
  isContacting = false,
}: TutorCTACardProps) {
  return (
    <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 shadow-sm">
      <div className="mb-4">
        <div className="text-3xl font-bold text-primary mb-2">
          {price.toLocaleString("vi-VN")}đ
        </div>
        <p className="text-sm text-muted-foreground">/giờ</p>
      </div>
      <BookingModal
        tutorId={tutorId}
        tutorName={tutorName}
        pricePerHour={price}
        tutorAvailableSlots={tutorAvailableSlots}
        trigger={
          <Button className="w-full bg-primary hover:bg-primary/90 mb-3">
            Đặt lịch học ngay
          </Button>
        }
      />
      <Button 
        variant="outline" 
        onClick={onContactChat} 
        disabled={isContacting}
        className="w-full flex items-center justify-center gap-2"
      >
        {isContacting && <Loader2 className="size-4 animate-spin" />}
        Liên hệ qua chat
      </Button>
    </div>
  );
}
