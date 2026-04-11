import { Button } from "@/src/shared/components/ui/button";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 px-4 py-3 backdrop-blur-md sm:px-10">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          {/* <div className="flex size-8 items-center justify-center text-primary">
            <span className="material-symbols-outlined text-3xl">school</span>
          </div> */}
          <h2 className="text-lg font-bold tracking-[-0.015em] text-foreground">
            Edura
          </h2>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <nav className="flex items-center gap-6 lg:gap-9">
            <a
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              href="#tutors"
            >
              Tìm gia sư
            </a>
            <a
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              href="#cta"
            >
              Trở thành gia sư
            </a>
            <a
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              href="#features"
            >
              Tài liệu
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              className="h-10 border-border px-4 text-sm font-bold text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Link href="/login">Đăng nhập</Link>
            </Button>
            <Button asChild className="h-10 px-4 text-sm font-bold">
              <Link href="/register">Đăng ký</Link>
            </Button>
          </div>
        </div>

        <button
          className="p-2 text-foreground md:hidden"
          aria-label="Open menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
    </header>
  );
}
