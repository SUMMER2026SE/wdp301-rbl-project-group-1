"use client";

import { Button } from "@/src/shared/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/shared/components/ui/sheet";
import { cn } from "@/src/shared/lib/utils";
import { LogOut, Menu, ScrollText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV_LINKS } from "./admin-sidebar";

export function AdminMobileMenu() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 gap-0 p-0" showCloseButton>
        <SheetHeader className="border-b border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ScrollText className="size-5" />
            </div>
            <div className="min-w-0 text-left">
              <SheetTitle className="truncate text-base font-bold">
                Hệ thống Quản trị
              </SheetTitle>
              <p className="text-xs text-muted-foreground">Trung tâm điều hành</p>
            </div>
          </div>
        </SheetHeader>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {ADMIN_NAV_LINKS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <SheetClose key={item.href} asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                    isActive && "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
                  )}
                >
                  <Icon className="size-5" />
                  <span>{item.label}</span>
                </Link>
              </SheetClose>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <SheetClose asChild>
            <Link
              href="/login"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <LogOut className="size-5" />
              <span>Đăng xuất</span>
            </Link>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
