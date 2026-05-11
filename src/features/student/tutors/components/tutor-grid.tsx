"use client";

import { Pagination } from "@/src/shared/components/molecules/pagination";
import { TutorGridHeader } from "@/src/shared/components/molecules/tutor-grid-header";
import { useState } from "react";
import type { Tutor } from "../types";
import { TutorCard } from "./tutor-card";

interface TutorGridProps {
  tutors?: Tutor[];
  totalCount?: number;
  sortBy?: string;
  onSortChange?: (value: string) => void;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export function TutorGrid({
  tutors = [],
  totalCount = 124,
  sortBy: externalSortBy,
  onSortChange: externalOnSortChange,
  currentPage: externalCurrentPage,
  onPageChange: externalOnPageChange,
}: TutorGridProps) {
  const [internalSortBy, setInternalSortBy] = useState("rating");
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);

  const sortBy = externalSortBy ?? internalSortBy;
  const currentPage = externalCurrentPage ?? internalCurrentPage;
  const handleSortChange = externalOnSortChange ?? setInternalSortBy;
  const handlePageChange = externalOnPageChange ?? setInternalCurrentPage;

  const itemsPerPage = 9;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const sortedTutors = [...tutors].sort((a, b) => {
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

  const paginatedTutors = sortedTutors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="flex-1">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {paginatedTutors.map((tutor) => (
          <TutorCard key={tutor.id} tutor={tutor} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
