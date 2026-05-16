import { CourseCard } from "./course-card";

interface Course {
  id: string;
  subject: string;
  title: string;
  studentCount: string;
  schedule: string;
  meetLink: string;
  color: "blue" | "purple" | "green";
}

interface CourseGridProps {
  courses: Course[];
}

export function CourseGrid({ courses }: CourseGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          id={course.id}
          subject={course.subject}
          title={course.title}
          studentCount={course.studentCount}
          schedule={course.schedule}
          meetLink={course.meetLink}
          color={course.color}
        />
      ))}
    </div>
  );
}
