"use client";

import { Pagination } from "@/src/shared/components/molecules/pagination/pagination";
import { SortSelect } from "@/src/shared/components/molecules/sort-select/sort-select";
import { useState } from "react";
import type { Course } from "../types";
import { CourseCard } from "./course-card";

const SORT_OPTIONS = [
  { value: "popular", label: "Phổ biến nhất" },
  { value: "rating", label: "Đánh giá cao nhất" },
  { value: "price-low", label: "Giá thấp nhất" },
  { value: "price-high", label: "Giá cao nhất" },
  { value: "newest", label: "Mới nhất" },
];

const ITEMS_PER_PAGE = 8;

interface CoursesGridProps {
  courses: Course[];
  totalCount: number;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export function CoursesGrid({
  courses,
  totalCount,
  sortBy,
  onSortChange,
}: CoursesGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // TODO: Move sorting to server when API is ready
  // Pass sortBy as a query param: GET /courses?sortBy=popular&page=1&limit=8
  const sortedCourses = [...courses].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "popular":
        return b.studentCount - a.studentCount;
      default:
        return 0;
    }
  });

  // TODO: Replace with server-side pagination via RTK Query
  // useGetCoursesQuery({ page: currentPage, limit: ITEMS_PER_PAGE, sortBy, ...filters })
  const paginatedCourses = sortedCourses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleSortChange = (value: string) => {
    onSortChange(value);
    setCurrentPage(1);
  };

  return (
    <div className="flex-1 min-w-0">
      {/* Sort controls */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground text-sm">
          Tìm thấy{" "}
          <span className="font-bold text-foreground">{totalCount}</span> khóa
          học phù hợp
        </p>
        <SortSelect
          value={sortBy}
          onChange={handleSortChange}
          options={SORT_OPTIONS}
        />
      </div>

      {/* Course grid */}
      {paginatedCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {paginatedCourses.map((course) => (
            <CourseCard key={course.id} course={course} variant="grid" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground text-lg font-medium">
            Không tìm thấy khóa học phù hợp
          </p>
          <p className="text-muted-foreground text-sm mt-1">
            Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
          </p>
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
