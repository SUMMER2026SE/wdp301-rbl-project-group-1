"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

import { useRescheduleSessionMutation } from "@/src/features/booking/bookingApi";
import { Button } from "@/src/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/shared/components/ui/dialog";
import { Input } from "@/src/shared/components/ui/input";
import { Textarea } from "@/src/shared/components/ui/textarea";
import { Label } from "@/src/shared/components/ui/label";
import { Calendar, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface RescheduleSessionModalProps {
  sessionId: string;
  trigger: React.ReactNode;
  currentStartTime: string;
  currentEndTime: string;
}

export function RescheduleSessionModal({
  sessionId,
  trigger,
  currentStartTime,
  currentEndTime,
}: RescheduleSessionModalProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [reason, setReason] = useState<string>("");

  const [rescheduleSession, { isLoading }] = useRescheduleSessionMutation();

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setDate("");
      setStartTime("");
      setEndTime("");
      setReason("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !startTime || !endTime) {
      toast.error("Vui lòng điền đầy đủ ngày và giờ dự kiến.");
      return;
    }

    const proposedStartTime = new Date(`${date}T${startTime}:00`).toISOString();
    const proposedEndTime = new Date(`${date}T${endTime}:00`).toISOString();

    try {
      await rescheduleSession({
        sessionId,
        rescheduleSessionDto: {
          proposedStartTime,
          proposedEndTime,
          proposedReason: reason || undefined,
        },
      }).unwrap();

      toast.success("Đã gửi yêu cầu dời lịch thành công.");
      setOpen(false);
    } catch (error) {
      const err = error as { data?: { message?: string } };
      const message =
        err?.data?.message || "Không thể gửi yêu cầu dời lịch lúc này.";
      toast.error(message);
    }
  };

  const currentStartDate = new Date(currentStartTime);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Yêu cầu dời lịch học</DialogTitle>
          <DialogDescription>
            Gửi yêu cầu dời lịch học tới đối tác. Yêu cầu cần được xác nhận để
            chính thức áp dụng.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Lịch học hiện tại</Label>
            <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg border border-border">
              <Calendar className="size-4" />
              <span>
                {format(currentStartDate, "dd/MM/yyyy", { locale: vi })}
              </span>
              <span className="mx-1">•</span>
              <Clock className="size-4" />
              <span>
                {format(currentStartDate, "HH:mm")} -{" "}
                {format(new Date(currentEndTime), "HH:mm")}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Ngày học mới</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Giờ bắt đầu</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">Giờ kết thúc</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Lý do dời lịch (tùy chọn)</Label>
            <Textarea
              id="reason"
              placeholder="Nhập lý do để đối tác dễ dàng nắm bắt thông tin..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Gửi yêu cầu
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
