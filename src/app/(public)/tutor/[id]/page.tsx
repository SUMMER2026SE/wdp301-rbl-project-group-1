"use client";

import { useGetUserProfileByIdQuery } from "@/src/features/user/userApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/shared/components/ui/avatar";
import { Card } from "@/src/shared/components/ui/card";
import { Skeleton } from "@/src/shared/components/ui/skeleton";
import { getSummaryName } from "@/src/shared/utils/common";
import { GraduationCap, MapPin, Star, Users, Briefcase, Clock } from "lucide-react";
import Link from "next/link";
import { use } from "react";

export default function PublicTutorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { data, isLoading, isError } = useGetUserProfileByIdQuery({ id: resolvedParams.id });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 p-4 md:p-8 max-w-7xl mx-auto">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !data?.data || data.data.role !== "TUTOR") {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <h2 className="text-2xl font-bold text-foreground">Không tìm thấy gia sư</h2>
        <p className="text-muted-foreground mt-2 mb-6">
          Gia sư này không tồn tại hoặc đã bị xóa.
        </p>
        <Link href="/" className="text-primary hover:underline">
          Quay lại danh sách gia sư
        </Link>
      </div>
    );
  }

  const { profile, tutor } = data.data;
  const displayName = profile?.nickname ?? "Gia sư";
  const initials = getSummaryName(displayName);

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-2">
        <Link
          href="/"
          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Quay lại danh sách gia sư
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <Card className="p-6 flex flex-col items-center text-center bg-card shadow-sm border border-border">
            <Avatar className="h-32 w-32 border-4 border-card shadow-md mb-4">
              <AvatarImage src={profile?.avatarUrl ?? undefined} alt={displayName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <h3 className="text-2xl font-bold text-foreground">{displayName}</h3>
            <p className="text-sm font-medium text-primary mt-1">
              {tutor?.specialization ?? "Giáo viên"}
            </p>

            <div className="flex items-center gap-4 mt-6">
              <div className="flex flex-col items-center">
                <span className="flex items-center gap-1 font-bold text-lg">
                  {tutor?.rating ?? 0} <Star className="w-4 h-4 fill-warning text-warning" />
                </span>
                <span className="text-xs text-muted-foreground">
                  ({tutor?.reviewCount ?? 0} đánh giá)
                </span>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div className="flex flex-col items-center">
                <span className="font-bold text-lg">{tutor?.studentCount ?? 0}</span>
                <span className="text-xs text-muted-foreground">Học sinh</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card shadow-sm border border-border">
            <h4 className="font-semibold text-foreground mb-4">Thông tin cơ bản</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Kinh nghiệm</p>
                  <p className="text-sm text-muted-foreground">
                    {tutor?.experience ? `${tutor.experience} năm` : "Chưa cập nhật"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <GraduationCap className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Học vấn</p>
                  <p className="text-sm text-muted-foreground">
                    {tutor?.education ?? "Chưa cập nhật"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Khu vực</p>
                  <p className="text-sm text-muted-foreground">
                    Việt Nam
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="p-6 bg-card shadow-sm border border-border">
            <h3 className="text-lg font-bold text-foreground mb-4">Giới thiệu bản thân</h3>
            <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {tutor?.bio ?? "Gia sư chưa cập nhật phần giới thiệu."}
            </div>
          </Card>

          <Card className="p-6 bg-card shadow-sm border border-border">
            <h3 className="text-lg font-bold text-foreground mb-4">Học phí</h3>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mức lương yêu cầu</p>
                <p className="text-xl font-bold text-foreground">
                  {tutor?.pricePerHour ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tutor.pricePerHour) : "Thỏa thuận"} / giờ
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
