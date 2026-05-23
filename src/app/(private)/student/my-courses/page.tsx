"use client";

import CourseGrid from "@/src/features/student/my-courses/components/course-grid";
import FilterTabs from "@/src/features/student/my-courses/components/filter-tabs";
import { useState } from "react";

export default function StudentCoursesPage() {
  const [filter, setFilter] = useState<"studying" | "completed">("studying");

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-8 md:px-10">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-white md:text-4xl">
            Khóa học của tôi
          </h1>
          <FilterTabs activeFilter={filter} onFilterChange={setFilter} />
        </div>

        {/* Course Grid */}
        <CourseGrid filter={filter} />
      </div>
    </div>
  );
}
