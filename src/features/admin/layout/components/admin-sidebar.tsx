"use client";

import { cn } from "@/src/shared/lib/utils";
import {
  BookOpen,
  CircleDollarSign,
  FileWarning,
  Home,
  LogOut,
  ScrollText,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const ADMIN_NAV_LINKS = [
  { label: "Tổng quan", href: "/admin", icon: Home },
  { label: "Phê duyệt Gia sư", href: "/admin/tutor-approvals", icon: UserCheck },
  { label: "Quản lý Khóa học", href: "/admin/courses", icon: BookOpen },
  { label: "Kiểm duyệt Nội dung", href: "/admin/moderation", icon: ShieldCheck },
  { label: "Giao dịch & Rút tiền", href: "/admin/transactions", icon: CircleDollarSign },
  { label: "Báo cáo & Khiếu nại", href: "/admin/reports", icon: FileWarning },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
      <div className="flex items-center gap-3 border-b border-border p-4">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <ScrollText className="size-5" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-base font-bold leading-tight text-foreground">
            Hệ thống Quản trị
          </h1>
          <p className="text-xs text-muted-foreground">Trung tâm điều hành</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {ADMIN_NAV_LINKS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                isActive && "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
              )}
            >
              <Icon className="size-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <Link
          href="/login"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="size-5" />
          <span>Đăng xuất</span>
        </Link>
      </div>
    </aside>
  );
}
