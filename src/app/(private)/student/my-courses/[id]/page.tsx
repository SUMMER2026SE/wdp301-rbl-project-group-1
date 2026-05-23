"use client";

import {
  CourseContent,
  CourseHeader,
  OnlineClassInfo,
  ProgressCircle,
  RelatedDocuments,
} from "@/src/features/student/courses-detail/components";
import { mockCourseDetail } from "@/src/features/student/mock-data";
import { mockTutoringCourse } from "@/src/features/student/tutoring-mock-data";
import { BreadcrumbNav } from "@/src/shared/components/molecules/breadcrumb-nav/breadcrumb-nav";

export default function CourseDetailPage() {
  // Use mockTutoringCourse for sidebar/header, but mockCourseDetail for content if needed
  const course = mockTutoringCourse;

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-8 md:px-10">
      <BreadcrumbNav
        items={[
          { label: "Khóa học của tôi", href: "/student/my-courses" },
          { label: course.title },
        ]}
      />

      <div className="flex flex-col lg:flex-row gap-8 mt-6">
        {/* Main Content */}
        <div className="w-full lg:w-[70%] space-y-8">
          <CourseHeader
            course={{
              title: course.title,
              tutorName: course.tutorName,
              tutorAvatar: course.tutorAvatar,
              chapters: mockCourseDetail.chapters,
              totalLessons: 12,
            }}
          />

          <CourseContent course={mockCourseDetail} />
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[30%] flex flex-col gap-6">
          <ProgressCircle
            progress={75} // Mock data matching image
            completedLessons={9}
            totalLessons={12}
          />

          <OnlineClassInfo
            platform={course.platform}
            schedule={course.schedule}
          />

          {/* Related documents would go here if available in TutoringCourse */}
          {course.documentCategories?.[0]?.documents && (
            <RelatedDocuments
              documents={course.documentCategories[0].documents.slice(0, 2)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
