"use client";

import { Avatar } from "@/src/shared/components/atoms/avatar/avatar";
import { Badge } from "@/src/shared/components/ui/badge";
import { Button } from "@/src/shared/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Check, Eye, X } from "lucide-react";
import { CertificateList } from "./certificate-list";
import { TutorApplication } from "./tutor-approvals.types";

export const tutorApprovalColumns: ColumnDef<TutorApplication>[] = [
  {
    accessorKey: "name",
    header: "Gia sư",
    cell: ({ row }) => {
      const application = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar size="md" fallback={application.name} />
          <div>
            <p className="font-medium text-foreground">{application.name}</p>
            <p className="text-xs text-muted-foreground">{application.email}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "subjects",
    header: "Chuyên môn",
    cell: ({ row }) => {
      const application = row.original;
      return (
        <div className="flex flex-wrap gap-1">
          {application.subjects.map((subject) => (
            <Badge key={subject} variant="secondary">
              {subject}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "certificates",
    header: "Bằng cấp/Chứng chỉ",
    cell: ({ row }) => {
      const application = row.original;
      return <CertificateList certificates={application.certificates} />;
    },
  },
  {
    accessorKey: "submittedAt",
    header: "Ngày gửi",
    cell: ({ row }) => {
      const application = row.original;
      return (
        <span className="text-muted-foreground">{application.submittedAt}</span>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Trạng thái</div>,
    cell: () => {
      return (
        <div className="flex justify-center">
          <Badge className="h-5 rounded-full border border-warning/20 bg-warning-soft px-2 text-[10px] text-warning hover:bg-warning-soft">
            Đang chờ
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Thao tác</div>,
    cell: () => {
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
          <Button
            size="icon-sm"
            className="bg-success text-success-foreground hover:bg-success/90"
            title="Phê duyệt"
          >
            <Check className="size-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon-sm"
            className="bg-error text-error-foreground hover:bg-error/90"
            title="Từ chối"
          >
            <X className="size-4" />
          </Button>
        </div>
      );
    },
  },
];
