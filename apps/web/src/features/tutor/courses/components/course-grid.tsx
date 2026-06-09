import { BookingResponseDto } from "@/src/features/booking/bookingApi";
import { CourseCard } from "./course-card";

interface CourseGridProps {
  courses: BookingResponseDto[];
}

export function CourseGrid({ courses }: CourseGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((booking) => (
        <CourseCard
          key={booking.id}
          booking={booking}
        />
      ))}
    </div>
  );
}
