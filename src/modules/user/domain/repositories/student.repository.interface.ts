import { Student } from '../entities/student.entity';

export const IStudentRepository = Symbol('IStudentRepository');
export interface IStudentRepository {
  findByUserId(userId: string): Promise<Student | null>;
  save(student: Student): Promise<void>;
  updateGrades(studentId: string, gradeIds: string[]): Promise<void>;
  updateSubjects(studentId: string, subjectIds: string[]): Promise<void>;
}
