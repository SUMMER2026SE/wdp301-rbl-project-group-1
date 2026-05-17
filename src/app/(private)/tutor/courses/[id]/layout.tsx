"use client";

import {
  BreadcrumbSection,
  HeaderSection,
  TabsSection,
} from "@/src/features/tutor/courses-detail/components";
import { useParams, usePathname } from "next/navigation";

// Mock course data
const coursesData: Record<
  string,
  {
    name: string;
    description: string;
  }
> = {
  "1": {
    name: "Toán 10 - Nhóm A (Cơ bản)",
    description: "Quản lý lịch học",
  },
  "2": {
    name: "IELTS Foundation - Lớp CĐ1",
    description: "Quản lý lớp học chi tiết",
  },
  "3": {
    name: "Lý 12 - Ôn thi THPT Quốc Gia (Kèm 1-1)",
    description: "Quản lý lớp học chi tiết",
  },
  "4": {
    name: "Toán 11 - Nâng cao",
    description: "Quản lý lớp học chi tiết",
  },
};

export default function CourseDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const courseId = params.id as string;
  const courseData = coursesData[courseId] || coursesData["1"];

  const courseName = courseData.name;
  const courseDescription = courseData.description;

  const tabs = [
    {
      label: "Tổng quan",
      href: `/tutor/courses/${courseId}`,
      isActive: pathname === `/tutor/courses/${courseId}`,
    },
    {
      label: "Học sinh",
      href: `/tutor/courses/${courseId}/student`,
      isActive: pathname === `/tutor/courses/${courseId}/student`,
    },
    {
      label: "Lịch học",
      href: `/tutor/courses/${courseId}/schedule`,
      isActive: pathname === `/tutor/courses/${courseId}/schedule`,
    },
    {
      label: "Tài liệu & Bài tập",
      href: `/tutor/courses/${courseId}/resource`,
      isActive: pathname === `/tutor/courses/${courseId}/resource`,
    },
    {
      label: "Điểm danh",
      href: `/tutor/courses/${courseId}/attendance`,
      isActive: pathname === `/tutor/courses/${courseId}/attendance`,
    },
  ];

  return (
    <main className="flex flex-1 justify-center py-8 px-4 md:px-10">
      <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 w-full gap-8">
        {/* Breadcrumb */}
        <div className="flex flex-col gap-4">
          <BreadcrumbSection courseName={courseName} />

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
