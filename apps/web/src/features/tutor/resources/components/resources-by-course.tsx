import { IconStatCard } from "@/src/shared/components/molecules/icon-stat-card/icon-stat-card";
import { CourseResources } from "../types";

interface ResourcesByCourseProps {
  courses: CourseResources[];
}

export function ResourcesByCourse({ courses }: ResourcesByCourseProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-bold text-foreground">
        Tài liệu theo lớp học
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <IconStatCard
            key={course.courseId}
            href={`/tutor/courses/${course.courseId}/resource`}
            title={course.courseName}
            subtitle={`${course.resourceCount} tài liệu`}
            icon={
              <span className="material-symbols-outlined text-[24px] leading-none">
                class
              </span>
            }
            iconWrapperClassName="bg-indigo-soft text-indigo"
            className="p-5"
          />
        ))}
      </div>
    </section>
  );
}
