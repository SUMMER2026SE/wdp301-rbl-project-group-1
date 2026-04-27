import { type Course } from '../entities/course.entity';

export const ICourseRepository = Symbol('ICourseRepository');

export interface ICourseRepository {
  create(course: Course): Promise<Course>;
  findById(id: string): Promise<Course | null>;
  findAll(): Promise<Course[]>;
}
