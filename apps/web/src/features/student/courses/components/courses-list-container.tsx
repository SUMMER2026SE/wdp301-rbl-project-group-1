"use client";

import { useGetAllCoursesQuery } from "@/src/features/course/courseApi";
import { FilterSidebar } from "@/src/shared/components/organisms/filter-sidebar";
import { useDebounce } from "@/src/shared/hooks/use-debounce";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppSelector } from "@/src/shared/store/hooks";
import { useMemo, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  coursesFilterSchema,
  type CoursesFilterFormData,
} from "../schemas/filter.schema";
import type { Course } from "../types";
import { CoursesGrid } from "./courses-grid";
import { CoursesSearchSection } from "./courses-search-section";

import { useGetAllSubjectsQuery } from "@/src/features/academic-catalog/academicCatalogApi";

const FORMATS = [
  { id: "online", label: "Trực tuyến" },
  { id: "offline", label: "Offline" },
];

const DEFAULT_PRICE_MIN = 0;
const DEFAULT_PRICE_MAX = 2000000;

export function CoursesListContainer() {
  const [currentPage, setCurrentPage] = useState(1);

  const form = useForm<CoursesFilterFormData>({
    resolver: zodResolver(coursesFilterSchema),
    defaultValues: {
      subjects: [],
      formats: [],
      priceRange: [DEFAULT_PRICE_MIN, DEFAULT_PRICE_MAX],
      rating: 0,
      search: "",
      sortBy: "popular",
    },
  });

  const search = form.watch("search");
  const debouncedSearch = useDebounce(search, 500);
  const subjects = form.watch("subjects");
  const formats = form.watch("formats");
  const priceRange = form.watch("priceRange");
  const rating = form.watch("rating");
  const sortBy = form.watch("sortBy");

  // Map local sortBy to API sortBy and sortOrder
  const apiSortParams = useMemo(() => {
    switch (sortBy) {
      case "price-low":
        return { sortBy: "price", sortOrder: "asc" as const };
      case "price-high":
        return { sortBy: "price", sortOrder: "desc" as const };
      case "newest":
        return { sortBy: "createdAt", sortOrder: "desc" as const };
      case "rating": // Not natively supported yet, mapping to createdAt
        return { sortBy: "createdAt", sortOrder: "desc" as const };
      case "popular": // Not natively supported yet, mapping to createdAt
        return { sortBy: "createdAt", sortOrder: "desc" as const };
      default:
        return { sortBy: "createdAt", sortOrder: "desc" as const };
    }
  }, [sortBy]);

  // Fetch subjects for filter
  const { data: subjectsResponse } = useGetAllSubjectsQuery();
  const subjectsData = useMemo(
    () => subjectsResponse?.data || [],
    [subjectsResponse?.data],
  );
  const subjectNames = useMemo(
    () => subjectsData.map((s) => s.name),
    [subjectsData],
  );

  // Map selected subject names back to subject IDs for the API
  const selectedSubjectIds = useMemo(() => {
    if (!subjects || subjects.length === 0) return undefined;
    return subjectsData
      .filter((s) => subjects.includes(s.name))
      .map((s) => s.id);
  }, [subjects, subjectsData]);

  const isInitializing = useAppSelector((state) => state.auth.isInitializing);

  // Query courses from API
  const {
    data: coursesResponse,
    isFetching,
  } = useGetAllCoursesQuery({
    page: currentPage.toString(),
    limit: "8",
    search: debouncedSearch || undefined,
    sortBy: apiSortParams.sortBy,
    sortOrder: apiSortParams.sortOrder,
    subjectIds: selectedSubjectIds,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    status: undefined, 
  }, {
    skip: isInitializing
  });

  // Debug removed

  const apiCourses = coursesResponse?.data || [];
  const totalCount = coursesResponse?.meta?.total || 0;
  const totalPages = coursesResponse?.meta?.totalPages || 0;

  // Map API courses to UI components interface
  let filteredCourses: Course[] = apiCourses.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description || "",
    subject: c.subject.name || "Khác",
    level: c.level,
    format: "online", // Mock since API doesn't support format yet
    instructor: {
      id: c.tutor.id || c.tutorId,
      name: c.tutor.name || "Gia sư",
      avatarUrl: c.tutor.avatarUrl || "https://github.com/shadcn.png",
      role: "Gia sư",
    },
    rating: 4.5, // Mock
    reviewCount: 0,
    studentCount: 0,
    price: c.price || 0,
    status: "suggested",
    isEnrolled: c.isEnrolled,
  }));

  // sau ni có rating sẽ đưa vào API filter luôn, tạm thời filter client ở đây
  filteredCourses = filteredCourses.filter((course) => {
    if (formats.length > 0 && !formats.includes(course.format)) return false;
    if (rating > 0 && course.rating < rating) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Search hero */}
      <CoursesSearchSection form={form} totalCount={totalCount} />

      {/* Filter sidebar + results grid */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <FilterSidebar
          subjects={{
            items: subjectNames,
            selected: subjects,
            onChange: (v) => form.setValue("subjects", v),
          }}
          secondary={{
            label: "Hình thức",
            items: FORMATS,
            selected: formats,
            onChange: (v) => form.setValue("formats", v),
          }}
          price={{
            label: "Khoảng học phí (VND)",
            current: priceRange,
            sliderMin: DEFAULT_PRICE_MIN,
            sliderMax: DEFAULT_PRICE_MAX,
            step: 100000,
            onChange: (min, max) => form.setValue("priceRange", [min, max]),
          }}
          rating={{
            value: rating,
            onChange: (v) => form.setValue("rating", v),
          }}
          onClear={() =>
            form.reset({
              subjects: [],
              formats: [],
              priceRange: [DEFAULT_PRICE_MIN, DEFAULT_PRICE_MAX],
              rating: 0,
              search: "",
              sortBy: "popular",
            })
          }
        />
        <CoursesGrid
          courses={filteredCourses}
          totalCount={totalCount}
          totalPages={totalPages}
          currentPage={currentPage}
          sortBy={sortBy}
          isLoading={isFetching}
          onSortChange={(v) => {
            form.setValue("sortBy", v);
            setCurrentPage(1);
          }}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
