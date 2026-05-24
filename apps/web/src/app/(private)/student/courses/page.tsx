import {
  CoursesListContainer,
  SuggestedCoursesCarousel,
} from "@/src/features/student/courses/components";
import { SUGGESTED_COURSES } from "@/src/features/student/courses/mock-data";

export default function StudentAllCoursesPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-8 md:px-10">
      <div className="flex flex-col gap-10">
        {/* 1. Suggested courses carousel — top of page */}
        <SuggestedCoursesCarousel courses={SUGGESTED_COURSES} />

        {/* 2. Search hero + filter sidebar + results grid */}
        <CoursesListContainer />
      </div>
    </div>
  );
}
