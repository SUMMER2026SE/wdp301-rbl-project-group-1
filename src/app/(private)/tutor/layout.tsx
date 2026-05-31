import Link from "next/link";

import { NotificationPopover } from "@/src/shared/components/molecules/notification-popover/notification-popover";
import { TutorPopover } from "@/src/shared/components/molecules/tutor-popover/tutor-popover";
import { TutorHeaderUserInfo } from "@/src/features/tutor/layout/components/tutor-header-user-info";
import NavigationBar from "@/src/shared/components/organisms/navigation-bar/navigation-bar";
import { GraduationCap } from "lucide-react";

export default function TutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navLinks = [
    { key: "home", trigger: "Trang chủ", href: "/tutor/home" },
    { key: "schedule", trigger: "Lịch dạy", href: "/tutor/schedule" },
    { key: "tutor-requests", trigger: "Yêu cầu dạy kèm", href: "/tutor/tutor-request" },
    { key: "courses", trigger: "Lớp học của tôi", href: "/tutor/courses" },
    { key: "resources", trigger: "Tài liệu", href: "/tutor/resources" },
    {key: "requests", trigger: "Yêu cầu của học sinh", href: "/tutor/requests"},
    { key: "earnings", trigger: "Thu nhập", href: "/tutor/earnings" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background px-4 py-3 shadow-sm sm:px-10">
        <div className="flex items-center gap-4">
          <NavigationBar
            menu={navLinks}
            brand={
              <Link href="/student/home" className="flex items-center gap-4">
                <div className="flex size-8 items-center justify-center text-primary dark:text-primary">
                  <GraduationCap className="size-8" />
                </div>
                <h2 className="text-xl font-bold leading-tight tracking-tight text-foreground dark:text-foreground">
                  Edura
                </h2>
              </Link>
            }
          />
          <div className="ml-auto hidden shrink-0 items-center gap-6 md:flex">
            <NotificationPopover />
            <div className="flex items-center gap-4 border-l border-border pl-6">
              <TutorHeaderUserInfo />
              <TutorPopover />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
