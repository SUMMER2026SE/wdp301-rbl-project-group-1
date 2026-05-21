import { CourseStatus } from '../../../../../shared/domain/enums/enums';
import { CourseLevelType } from '../../../../course/domain/value-objects/course-level';

export interface RecommendedCourseItem {
  id: string;
  tutorId: string;
  title: string;
  description: string | null;
  price: number | null;
  level: CourseLevelType;
  status: CourseStatus;
  subject: { id: string; name: string | null };
  grade: { id: string; name: string | null };
  createdAt: Date;
}

export type GetRecommendedCoursesResult = RecommendedCourseItem[];
