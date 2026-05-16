"use client";

import {
  CourseGrid,
  FilterSection,
  HeaderSection,
  PaginationSection,
} from "@/src/features/tutor/courses/components";
import { useState } from "react";

const mockCourses = [
  {
    id: "1",
    subject: "Toán Học",
    title: "Toán 10 - Nhóm A (Cơ bản)",
    studentCount: "5 học sinh",
    schedule: "Thứ 3, Thứ 5 (18:00 - 19:30)",
    meetLink: "meet.google.com/abc-defg-hij",
    color: "blue" as const,
  },
  {
    id: "2",
    subject: "Tiếng Anh",
    title: "IELTS Foundation - Lớp CĐ1",
    studentCount: "8 học sinh",
    schedule: "Thứ 2, Thứ 4, Thứ 6 (19:30 - 21:00)",
    meetLink: "meet.google.com/xyz-uvwx-yz",
    color: "purple" as const,
  },
  {
    id: "3",
    subject: "Vật Lý",
    title: "Lý 12 - Ôn thi THPT Quốc Gia (Kèm 1-1)",
    studentCount: "1 học sinh (Em Bảo)",
    schedule: "Chủ nhật (08:00 - 10:00)",
    meetLink: "meet.google.com/qwe-rtyu-iop",
    color: "green" as const,
  },
  {
    id: "4",
    subject: "Toán Học",
    title: "Toán 11 - Nâng cao",
    studentCount: "12 học sinh",
    schedule: "Thứ 4, Thứ 7 (14:00 - 15:30)",
    meetLink: "meet.google.com/lkj-hgfd-sa",
    color: "blue" as const,
  },
];

const itemsPerPage = 3;

export default function TutorCoursesPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(mockCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedCourses = mockCourses.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <main className="flex flex-1 justify-center py-8 px-4 md:px-10">
      <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 w-full gap-8">
        {/* Header */}
        <HeaderSection />

        {/* Filters */}
        <FilterSection />

        {/* Course Grid */}
        <CourseGrid courses={displayedCourses} />

        {/* Pagination */}
        <PaginationSection
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </main>
  );
}
