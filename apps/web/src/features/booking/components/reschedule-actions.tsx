"use client";

import React from "react";
import { Button } from "@/src/shared/components/ui/button";
import { Loader2, Check, X } from "lucide-react";
import { toast } from "sonner";
import {
  useApproveRescheduleSessionMutation,
  useRejectRescheduleSessionMutation,
} from "@/src/features/booking/bookingApi";

interface ActionProps {
  sessionId: string;
}

export function ApproveRescheduleButton({ sessionId }: ActionProps) {
  const [approveReschedule, { isLoading }] = useApproveRescheduleSessionMutation();

  const handleApprove = async () => {
    try {
      await approveReschedule({ sessionId }).unwrap();
      toast.success("Đã chấp nhận yêu cầu dời lịch.");
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Không thể chấp nhận yêu cầu lúc này.");
    }
  };

  return (
    <Button
      variant="default"
      size="sm"
      className="gap-1 bg-blue-600 hover:bg-blue-700 text-white"
      onClick={handleApprove}
      disabled={isLoading}
    >
      {isLoading ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
      Chấp nhận
    </Button>
  );
}

export function RejectRescheduleButton({ sessionId }: ActionProps) {
  const [rejectReschedule, { isLoading }] = useRejectRescheduleSessionMutation();

  const handleReject = async () => {
    try {
      await rejectReschedule({ sessionId }).unwrap();
      toast.success("Đã từ chối yêu cầu dời lịch.");
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Không thể từ chối yêu cầu lúc này.");
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-1 text-destructive border-destructive/30 hover:bg-destructive/10"
      onClick={handleReject}
      disabled={isLoading}
    >
      {isLoading ? <Loader2 className="size-3.5 animate-spin" /> : <X className="size-3.5" />}
      Từ chối
    </Button>
  );
}
