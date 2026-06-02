"use client";

import {
  CourseGrid,
  FilterSection,
  HeaderSection,
} from "@/src/features/tutor/courses/components";
import { Pagination } from "@/src/shared/components/molecules/pagination/pagination";
import { useState } from "react";
import { useGetBookingsQuery, BookingResponseDto } from "@/src/features/booking/bookingApi";

export default function TutorCoursesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const limit = 12;

  const { data, isLoading, error } = useGetBookingsQuery({
    limit,
    page: currentPage,
    status: statusFilter === "ALL" ? undefined : (statusFilter as "PENDING" | "AWAITING_PAYMENT" | "CONFIRMED" | "COMPLETED" | "CANCELLED"),
  });

  const bookings: BookingResponseDto[] = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <main className="flex flex-1 justify-center py-8 px-4 md:px-10">
      <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 w-full gap-8">
        {/* Header */}
        <HeaderSection />

        {/* Filters */}
        <FilterSection 
          onStatusChange={setStatusFilter}
          onSubjectChange={() => {}}
          onSearch={() => {}}
        />

        {/* Course Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24 text-slate-500 font-medium">Đang tải danh sách lớp học...</div>
        ) : error ? (
          <div className="flex items-center justify-center py-24 text-rose-500 font-medium">Có lỗi xảy ra khi tải dữ liệu.</div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-500 bg-slate-50 dark:bg-slate-800/30 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-700">
             <p className="text-lg font-medium text-slate-600 dark:text-slate-400">Không tìm thấy lớp học nào.</p>
          </div>
        ) : (
          <CourseGrid courses={bookings} />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            className="mt-4"
          />
        )}
      </div>
    </main>
  );
}
