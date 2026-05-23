"use client";

import { FilterSidebar } from "@/src/shared/components/organisms/filter-sidebar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MOCK_COURSES } from "../mock-data";
import {
  coursesFilterSchema,
  type CoursesFilterFormData,
} from "../schemas/filter.schema";
import type { Course } from "../types";
import { CoursesGrid } from "./courses-grid";
import { CoursesSearchSection } from "./courses-search-section";

const SUBJECTS = [
  "Toán học",
  "Vật lý",
  "Tiếng Anh",
  "Hóa học",
  "Ngữ văn",
  "Sinh học",
  "Lập trình",
  "Kỹ năng mềm",
];

const FORMATS = [
  { id: "online", label: "Trực tuyến" },
  { id: "offline", label: "Offline" },
];

const DEFAULT_PRICE_MIN = 100000;
const DEFAULT_PRICE_MAX = 2000000;

export function CoursesListContainer() {
  // TODO: Replace MOCK_COURSES with RTK Query when API is ready
  // import { useGetCoursesQuery } from "@/src/features/courses/coursesApi";
  // const { data, isLoading } = useGetCoursesQuery({ page, limit, subjects, formats, priceMin, priceMax, rating, search, sortBy });
  const allCourses: Course[] = MOCK_COURSES;

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
  const subjects = form.watch("subjects");
  const formats = form.watch("formats");
  const priceRange = form.watch("priceRange");
  const rating = form.watch("rating");
  const sortBy = form.watch("sortBy");

  // TODO: Replace with server-side filtering when API is ready
  // Pass all filter values as query params to the API endpoint
  const filteredCourses = allCourses.filter((course) => {
    if (search) {
      const q = search.toLowerCase();
      const matchesSearch =
        course.title.toLowerCase().includes(q) ||
        course.subject.toLowerCase().includes(q) ||
        course.instructor.name.toLowerCase().includes(q) ||
        course.description.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    if (subjects.length > 0 && !subjects.includes(course.subject)) return false;

    if (formats.length > 0 && !formats.includes(course.format)) return false;

    if (course.price < priceRange[0] || course.price > priceRange[1])
      return false;

    if (rating > 0 && course.rating < rating) return false;

    return true;
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Search hero */}
      <CoursesSearchSection form={form} totalCount={filteredCourses.length} />

      {/* Filter sidebar + results grid */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <FilterSidebar
          subjects={{
            items: SUBJECTS,
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
            sliderMin: 100000,
            sliderMax: 2000000,
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
          totalCount={filteredCourses.length}
          sortBy={sortBy}
          onSortChange={(v) => form.setValue("sortBy", v)}
        />
      </div>
    </div>
  );
}
