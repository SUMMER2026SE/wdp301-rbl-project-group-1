"use client";

import {
  HeaderSection,
  TabsSection,
} from "@/src/features/tutor/courses-detail/components";
import { BreadcrumbNav } from "@/src/shared/components/molecules/breadcrumb-nav/breadcrumb-nav";
import { useParams, usePathname } from "next/navigation";
import { useGetBookingByIdQuery } from "@/src/features/booking/bookingApi";
import { Loader2 } from "lucide-react";

export default function CourseDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const bookingId = params.id as string;

  const { data: response, isLoading, isError } = useGetBookingByIdQuery({ id: bookingId });
  const booking = response?.data;

  if (isLoading) {
    return (
      <main className="flex flex-1 justify-center py-8 px-4 md:px-10">
        <div className="flex h-[50vh] w-full items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Đang tải thông tin lớp học...</span>
        </div>
      </main>
    );
  }

  if (isError || !booking) {
    return (
      <main className="flex flex-1 justify-center py-8 px-4 md:px-10">
        <div className="flex h-[50vh] w-full items-center justify-center">
          <p className="text-destructive font-medium">Không thể tải thông tin lớp học. Vui lòng thử lại sau.</p>
        </div>
      </main>
    );
  }

  const courseName = booking.subject?.name || "Lớp học gia sư";
  const courseDescription = `Trạng thái: ${
    booking.status === "PENDING"
      ? "Đang chờ duyệt"
      : booking.status === "CONFIRMED"
      ? "Đã xác nhận"
      : booking.status === "COMPLETED"
      ? "Đã hoàn thành"
      : "Đã hủy"
  }`;

  const tabs = [
    {
      label: "Tổng quan",
      href: `/tutor/courses/${bookingId}`,
      isActive: pathname === `/tutor/courses/${bookingId}`,
    },
    {
      label: "Tài liệu",
      href: `/tutor/courses/${bookingId}/resource`,
      isActive: pathname === `/tutor/courses/${bookingId}/resource`,
    },
    {
      label: "Điểm danh",
      href: `/tutor/courses/${bookingId}/attendance`,
      isActive: pathname === `/tutor/courses/${bookingId}/attendance`,
    },
  ];

  return (
    <main className="flex flex-1 justify-center py-8 px-4 md:px-10">
      <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 w-full gap-8">
        {/* Breadcrumb */}
        <div className="flex flex-col gap-4">
          <BreadcrumbNav
            items={[
              { label: "Lớp học của tôi", href: "/tutor/courses" },
              { label: courseName },
            ]}
          />

          {/* Header */}
          <HeaderSection
            courseName={courseName}
            description={courseDescription}
          />

          {/* Tabs */}
          <TabsSection tabs={tabs} />
        </div>

        {/* Content from child pages */}
        {children}
      </div>
    </main>
  );
}
