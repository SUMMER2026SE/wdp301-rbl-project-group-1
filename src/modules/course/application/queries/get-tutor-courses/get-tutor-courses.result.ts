import { CourseStatus } from '../../../../../shared/domain/enums/enums';
import { QueryApiResponse } from '../../../../../shared/presentation/responses/query-response';
import { CourseLevelType } from '../../../domain/value-objects/course-level';

export interface TutorCourseResultData {
  id: string;
  tutorId: string;
  title: string;
  description: string | null;
  price: number | null;
  subject: { id: string; name: string | null };
  grade: { id: string; name: string | null };
  level: CourseLevelType;
  status: CourseStatus;
  createdAt: Date;
}

export type GetTutorCoursesResult = QueryApiResponse<TutorCourseResultData>;
