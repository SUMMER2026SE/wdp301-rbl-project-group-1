"use client";

import { Avatar } from "@/src/shared/components/atoms/avatar/avatar";
import { Badge } from "@/src/shared/components/ui/badge";
import { Button } from "@/src/shared/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Check, Loader2, ShieldAlert, X } from "lucide-react";
import { toast } from "sonner";

import {
  useBanUserMutation,
  useUnbanUserMutation,
  UserResponseDto,
} from "@/src/features/user/userApi";

/** Format ISO date string to dd/MM/yyyy */
function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN");
}

function RoleBadge({ role }: { role: string }) {
  switch (role) {
    case "ADMIN":
      return <Badge className="bg-primary/20 text-primary border-primary/20">{role}</Badge>;
    case "TUTOR":
      return <Badge className="bg-info-soft text-info border-info/20">{role}</Badge>;
    case "STUDENT":
      return <Badge className="bg-success-soft text-success border-success/20">{role}</Badge>;
    default:
      return <Badge variant="secondary">{role}</Badge>;
  }
}

/**
 * Action cell rendered as a component so we can call hooks
 */
function ActionCell({ user }: { user: UserResponseDto }) {
  const [banUser, { isLoading: isBanning }] = useBanUserMutation();
  const [unbanUser, { isLoading: isUnbanning }] = useUnbanUserMutation();

  const isBusy = isBanning || isUnbanning;

  const handleBan = async () => {
    try {
      await banUser({ id: user.id }).unwrap();
      toast.success("Đã khóa tài khoản người dùng thành công.");
    } catch {
      toast.error("Khóa tài khoản thất bại. Vui lòng thử lại.");
    }
  };

  const handleUnban = async () => {
    try {
      await unbanUser({ id: user.id }).unwrap();
      toast.success("Đã mở khóa tài khoản người dùng.");
    } catch {
      toast.error("Mở khóa thất bại. Vui lòng thử lại.");
    }
  };

  if (user.role === "ADMIN") {
    return (
      <div className="flex justify-center text-muted-foreground text-xs">
        <ShieldAlert className="size-4 mr-1" /> Admin
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2">
      {user.isActive ? (
        <Button
          variant="destructive"
          size="sm"
          className="bg-error text-error-foreground hover:bg-error/90 h-8"
          title="Khóa tài khoản"
          disabled={isBusy}
          onClick={handleBan}
        >
          {isBanning ? (
            <Loader2 className="size-4 animate-spin mr-1" />
          ) : (
            <X className="size-4 mr-1" />
          )}
          Khóa
        </Button>
      ) : (
        <Button
          size="sm"
          className="bg-success text-success-foreground hover:bg-success/90 h-8"
          title="Mở khóa tài khoản"
          disabled={isBusy}
          onClick={handleUnban}
        >
          {isUnbanning ? (
            <Loader2 className="size-4 animate-spin mr-1" />
          ) : (
            <Check className="size-4 mr-1" />
          )}
          Mở khóa
        </Button>
      )}
    </div>
  );
}

export const userColumns: ColumnDef<UserResponseDto>[] = [
  {
    accessorKey: "email",
    header: "Người dùng",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar
            size="md"
            src={undefined}
            fallback={user.nickname ?? user.email}
          />
          <div>
            <p className="font-medium text-foreground">
              {user.nickname ?? "Chưa cập nhật"}
            </p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Vai trò",
    cell: ({ row }) => <RoleBadge role={row.original.role} />,
  },
  {
    accessorKey: "isActive",
    header: () => <div className="text-center">Trạng thái</div>,
    filterFn: (row, columnId, filterValue) => {
      if (filterValue === "all" || !filterValue) return true;
      const isActive = row.getValue(columnId);
      if (filterValue === "active") return isActive === true;
      if (filterValue === "banned") return isActive === false;
      return true;
    },
    cell: ({ row }) => {
      const isActive = row.original.isActive;
      return (
        <div className="flex justify-center">
          <Badge
            className={`h-5 rounded-full border px-2 text-[10px] ${
              isActive
                ? "border-success/20 bg-success-soft text-success"
                : "border-error/20 bg-error-soft text-error"
            }`}
          >
            {isActive ? "Hoạt động" : "Bị khóa"}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "reportCount",
    header: () => <div className="text-center">Bị báo cáo</div>,
    cell: ({ row }) => {
      const count = row.original.reportCount;
      return (
        <div className="flex justify-center text-sm">
          {count > 0 ? (
            <span className="text-error font-medium">{count}</span>
          ) : (
            <span className="text-muted-foreground">0</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tham gia",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground text-sm">
          {formatDate(row.original.createdAt)}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Thao tác</div>,
    cell: ({ row }) => <ActionCell user={row.original} />,
  },
];
