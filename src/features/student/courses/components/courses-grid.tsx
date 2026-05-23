"use client";

import { Pagination } from "@/src/shared/components/molecules/pagination/pagination";
import { SortSelect } from "@/src/shared/components/molecules/sort-select/sort-select";
import type { Course } from "../types";
import { CourseCard } from "./course-card";
import { Spinner } from "@/src/shared/components/ui/spinner";

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
  totalPages: number;
  currentPage: number;
  sortBy: string;
  isLoading?: boolean;
  onSortChange: (value: string) => void;
  onPageChange: (page: number) => void;
}

export function CoursesGrid({
  courses,
  totalCount,
  totalPages,
  currentPage,
  sortBy,
  isLoading,
  onSortChange,
  onPageChange,
}: CoursesGridProps) {
  const handleSortChange = (value: string) => {
    onSortChange(value);
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
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Spinner className="size-8" />
        </div>
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {courses.map((course) => (
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
      {!isLoading && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
