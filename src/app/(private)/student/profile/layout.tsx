import { ProfileSidebar } from "@/src/features/student/profile/components";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Hồ sơ cá nhân</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Quản lý thông tin cá nhân và cài đặt tài khoản của bạn.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <ProfileSidebar />
        <div className="flex-1 flex flex-col min-w-0">{children}</div>
      </div>
    </div>
  );
}
