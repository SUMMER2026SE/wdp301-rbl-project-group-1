"use client";

import { Badge } from "@/src/shared/components/ui/badge";
import { RequestStatus } from "../mocks/requests.mock";
import { CheckCircle2, CircleDashed, XCircle, CheckSquare } from "lucide-react";

interface RequestStatusBadgeProps {
  status: RequestStatus;
}

export function RequestStatusBadge({ status }: RequestStatusBadgeProps) {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="bg-warning-soft text-warning border-warning/30 gap-1.5 py-1 px-2.5 shadow-none rounded-full font-medium">
          <CircleDashed className="size-3.5" />
          Đang chờ
        </Badge>
      );
    case "accepted":
      return (
        <Badge variant="outline" className="bg-success-soft text-success border-success/30 gap-1.5 py-1 px-2.5 shadow-none rounded-full font-medium">
          <CheckCircle2 className="size-3.5" />
          Đã chấp nhận
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="outline" className="bg-error-soft text-error border-error/30 gap-1.5 py-1 px-2.5 shadow-none rounded-full font-medium">
          <XCircle className="size-3.5" />
          Đã từ chối
        </Badge>
      );
    case "completed":
      return (
        <Badge variant="outline" className="bg-info-soft text-info border-info/30 gap-1.5 py-1 px-2.5 shadow-none rounded-full font-medium">
          <CheckSquare className="size-3.5" />
          Hoàn thành
        </Badge>
      );
    case "awaiting_payment":
      return (
        <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200 gap-1.5 py-1 px-2.5 shadow-none rounded-full font-medium dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800/50">
          <CircleDashed className="size-3.5" />
          Chờ thanh toán
        </Badge>
      );
    case "confirmed":
      return (
        <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200 gap-1.5 py-1 px-2.5 shadow-none rounded-full font-medium dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50">
          <CheckSquare className="size-3.5" />
          Đã xác nhận
        </Badge>
      );
    default:
      return null;
  }
}
