export type CourseFormat = "online" | "offline";

export type CourseStatus = "hot" | "suggested";

export interface CourseInstructor {
  id: string;
  name: string;
  avatarUrl: string;
  role?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  subject: string;
  level: string;
  format: CourseFormat;
  instructor: CourseInstructor;
  rating: number;
  reviewCount: number;
  studentCount: number;
  price: number;
  status?: CourseStatus;
}
