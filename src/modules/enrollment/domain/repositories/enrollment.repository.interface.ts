import { Enrollment } from '../entities/enrollment.entity';

export const IEnrollmentRepository = Symbol('IEnrollmentRepository');

export interface IEnrollmentRepository {
  create(enrollment: Enrollment): Promise<Enrollment>;
  findByStudentAndCourse(
    studentId: string,
    courseId: string,
  ): Promise<Enrollment | null>;
  findById(id: string): Promise<Enrollment | null>;
  update(enrollment: Enrollment): Promise<Enrollment>;
}
