"use client";

import { Pagination } from "@/src/shared/components/molecules/pagination/pagination";
import { TutorGridHeader } from "@/src/features/student/tutors/components/tutor-grid-header";
import { Spinner } from "@/src/shared/components/ui/spinner";
import { useState } from "react";
import type { Tutor } from "../types";
import { TutorCard } from "./tutor-card";

interface TutorGridProps {
  tutors?: Tutor[];
  totalCount?: number;
  totalPages?: number;
  sortBy?: string;
  onSortChange?: (value: string) => void;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  itemsPerPage?: number;
  isServerPaging?: boolean;
  isLoading?: boolean;
}

export function TutorGrid({
  tutors = [],
  totalCount = 124,
  totalPages: externalTotalPages,
  sortBy: externalSortBy,
  onSortChange: externalOnSortChange,
  currentPage: externalCurrentPage,
  onPageChange: externalOnPageChange,
  itemsPerPage = 9,
  isServerPaging = false,
  isLoading = false,
}: TutorGridProps) {
  const [internalSortBy, setInternalSortBy] = useState("rating");
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);

  const sortBy = externalSortBy ?? internalSortBy;
  const currentPage = externalCurrentPage ?? internalCurrentPage;
  const handleSortChange = externalOnSortChange ?? setInternalSortBy;
  const handlePageChange = externalOnPageChange ?? setInternalCurrentPage;

  const totalPages = isServerPaging
    ? (externalTotalPages ?? 0)
    : Math.ceil(totalCount / itemsPerPage);

  const sortedTutors = isServerPaging
    ? [...tutors]
    : [...tutors].sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "price-low":
          return a.pricePerHour - b.pricePerHour;
        case "price-high":
          return b.pricePerHour - a.pricePerHour;
        case "experience":
          return (
            Number(b.experience.split(" ")[0]) -
            Number(a.experience.split(" ")[0])
          );
        default:
          return 0;
      }
    });

  const visibleTutors = isServerPaging
    ? sortedTutors
    : sortedTutors.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );

  return (
    <div className="flex-1 min-w-0">
      {/* Sort controls */}
      <TutorGridHeader
        totalCount={totalCount}
        sortBy={sortBy}
        onSortChange={(newSort) => {
          handleSortChange(newSort);
          handlePageChange(1);
        }}
      />

      {/* Tutors grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Spinner className="size-8" />
        </div>
      ) : visibleTutors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {visibleTutors.map((tutor) => (
            <TutorCard key={tutor.id} tutor={tutor} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground text-lg font-medium">
            Không tìm thấy gia sư phù hợp
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
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
