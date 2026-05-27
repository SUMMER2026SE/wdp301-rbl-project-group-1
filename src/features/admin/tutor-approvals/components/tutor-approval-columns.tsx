"use client";

import { Avatar } from "@/src/shared/components/atoms/avatar/avatar";
import { Badge } from "@/src/shared/components/ui/badge";
import { Button } from "@/src/shared/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Check, Eye, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import {
  useApproveTutorApplicationMutation,
  useRejectTutorApplicationMutation,
} from "@/src/features/tutor-application/tutorApplicationApi";
import type { TutorApplication } from "./tutor-approvals.types";

/** Status label/style mapping */
const statusMap: Record<
  TutorApplication["status"],
  { label: string; className: string }
> = {
  PENDING: {
    label: "Đang chờ",
    className:
      "border-warning/20 bg-warning-soft text-warning hover:bg-warning-soft",
  },
  APPROVED: {
    label: "Đã duyệt",
    className:
      "border-success/20 bg-success-soft text-success hover:bg-success-soft",
  },
  REJECTED: {
    label: "Từ chối",
    className:
      "border-error/20 bg-error-soft text-error hover:bg-error-soft",
  },
};

/** Format ISO date string to dd/MM/yyyy */
function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN");
}

/**
 * Action cell rendered as a component so we can call hooks
 * (RTK Query mutations must be called inside a React component).
 */
function ActionCell({ application }: { application: TutorApplication }) {
  const [approve, { isLoading: isApproving }] =
    useApproveTutorApplicationMutation();
  const [reject, { isLoading: isRejecting }] =
    useRejectTutorApplicationMutation();

  const isBusy = isApproving || isRejecting;
  const isActionable = application.status === "PENDING";

  const handleApprove = async () => {
    try {
      await approve({ id: application.id }).unwrap();
      toast.success("Đã phê duyệt gia sư thành công!");
    } catch {
      toast.error("Phê duyệt thất bại. Vui lòng thử lại.");
    }
  };

  const handleReject = async () => {
    try {
      await reject({ id: application.id }).unwrap();
      toast.success("Đã từ chối đơn ứng tuyển.");
    } catch {
      toast.error("Từ chối thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="secondary"
        size="icon-sm"
        className="bg-info-soft text-info hover:bg-info-soft/80"
        title="Xem chi tiết"
      >
        <Eye className="size-4" />
      </Button>

      {isActionable && (
        <>
          <Button
            size="icon-sm"
            className="bg-success text-success-foreground hover:bg-success/90"
            title="Phê duyệt"
            disabled={isBusy}
            onClick={handleApprove}
          >
            {isApproving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Check className="size-4" />
            )}
          </Button>
          <Button
            variant="destructive"
            size="icon-sm"
            className="bg-error text-error-foreground hover:bg-error/90"
            title="Từ chối"
            disabled={isBusy}
            onClick={handleReject}
          >
            {isRejecting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <X className="size-4" />
            )}
          </Button>
        </>
      )}
    </div>
  );
}

export const tutorApprovalColumns: ColumnDef<TutorApplication>[] = [
  {
    accessorKey: "email",
    header: "Gia sư",
    cell: ({ row }) => {
      const app = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar
            size="md"
            src={app.avatarUrl ?? undefined}
            fallback={app.email}
          />
          <div>
            <p className="font-medium text-foreground">
              {app.specialization}
            </p>
            <p className="text-xs text-muted-foreground">{app.email}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "subjects",
    header: "Chuyên môn",
    cell: ({ row }) => {
      const subjects = row.original.subjects;
      if (!subjects || subjects.length === 0) {
        return (
          <span className="text-xs text-muted-foreground">Chưa có</span>
        );
      }
      return (
        <div className="flex flex-wrap gap-1">
          {subjects.map((subject) => (
            <Badge key={subject.id} variant="secondary">
              {subject.name}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "education",
    header: "Học vấn",
    cell: ({ row }) => {
      const app = row.original;
      return (
        <span className="text-sm text-muted-foreground">
          {app.education ?? "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Ngày gửi",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground">
          {formatDate(row.original.createdAt)}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Trạng thái</div>,
    cell: ({ row }) => {
      const meta = statusMap[row.original.status];
      return (
        <div className="flex justify-center">
          <Badge
            className={`h-5 rounded-full border px-2 text-[10px] ${meta.className}`}
          >
            {meta.label}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Thao tác</div>,
    cell: ({ row }) => <ActionCell application={row.original} />,
  },
];
