"use client";

import { Button } from "@/src/shared/components/ui/button";
import { GraduationCap, Menu } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 px-4 py-3 backdrop-blur-md sm:px-10">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center text-primary">
            <GraduationCap />
          </div>
          <h2 className="text-lg font-bold tracking-[-0.015em] text-foreground">
            Edura
          </h2>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <nav className="flex items-center gap-6 lg:gap-9">
            <a
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              href="#tutors"
            >
              Tìm gia sư
            </a>
            <Link
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              href="/register-tutor"
            >
              Trở thành gia sư
            </Link>
            <a
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              href="#features"
            >
              Tài liệu
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              className="h-10 border-border px-4 text-sm font-bold text-muted-foreground hover:border-primary hover:text-primary"
            >
              <Link href="/login">Đăng nhập</Link>
            </Button>
            <Button
              asChild
              className="h-10 bg-primary px-4 text-sm font-bold text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/register">Đăng ký</Link>
            </Button>
          </div>
        </div>

        <Button
          variant="ghost"
          className="p-2 text-muted-foreground md:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </Button>
      </div>
    </header>
  );
}
