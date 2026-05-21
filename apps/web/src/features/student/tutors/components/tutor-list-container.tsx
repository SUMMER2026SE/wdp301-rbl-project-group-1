"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { filterSchema, type FilterFormData } from "../schemas/filter.schema";
import type { Tutor } from "../types";
import { FilterSidebar } from "./filter-sidebar";
import { SearchBar } from "./search-bar";
import { TutorGrid } from "./tutor-grid";

interface TutorListContainerProps {
  tutors: Tutor[];
  totalCount?: number;
}

export function TutorListContainer({ tutors }: TutorListContainerProps) {
  const form = useForm<FilterFormData>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      subjects: [],
      levels: [],
      priceRange: [50000, 1000000],
      rating: 0,
      search: "",
      sortBy: "rating",
    },
  });

  // Watch form values
  const search = form.watch("search");
  const subjects = form.watch("subjects");

  const priceRange = form.watch("priceRange");
  const rating = form.watch("rating");
  const sortBy = form.watch("sortBy");

  // Filter tutors based on form state
  const filteredTutors = tutors.filter((tutor) => {
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        tutor.name.toLowerCase().includes(searchLower) ||
        tutor.specialty.toLowerCase().includes(searchLower) ||
        tutor.skills.some((skill) => skill.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }

    // Subject filter
    if (subjects.length > 0) {
      const matchesSubject = tutor.skills.some((skill) =>
        subjects.some((subject) =>
          skill.toLowerCase().includes(subject.toLowerCase()),
        ),
      );
      if (!matchesSubject) return false;
    }

    // Price range filter
    if (
      tutor.pricePerHour < priceRange[0] ||
      tutor.pricePerHour > priceRange[1]
    ) {
      return false;
    }

    // Rating filter
    if (rating > 0 && tutor.rating < rating) {
      return false;
    }

    return true;
  });

  const handleSortChange = (value: string) => {
    form.setValue("sortBy", value);
  };

  return (
    <>
      {/* Hero search section */}
      <SearchBar
        value={search}
        onChange={(value) => form.setValue("search", value)}
      />

      {/* Main content */}
      <main className="w-full max-w-[1440px] mx-auto px-4 md:px-10 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter sidebar */}
          <FilterSidebar form={form} />

          {/* Tutors grid */}
          <TutorGrid
            tutors={filteredTutors}
            totalCount={filteredTutors.length}
            sortBy={sortBy}
            onSortChange={handleSortChange}
          />
        </div>
      </main>
    </>
  );
}
