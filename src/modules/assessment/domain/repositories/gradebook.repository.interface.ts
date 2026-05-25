import { GradebookRecord } from '../entities/gradebook-record.entity';

export const IGradebookRepository = Symbol('IGradebookRepository');

export interface IGradebookRepository {
  upsert(record: GradebookRecord): Promise<GradebookRecord>;
  findByStudentAndAssessment(
    studentId: string,
    assessmentId: string,
  ): Promise<GradebookRecord | null>;
  findByStudentAndCourse(
    studentId: string,
    courseId: string,
  ): Promise<GradebookRecord[]>;
  findByCourse(courseId: string): Promise<GradebookRecord[]>;
}
