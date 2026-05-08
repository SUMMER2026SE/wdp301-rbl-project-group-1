import { Lesson } from '../entities/lesson.entity';

export const ILessonRepository = Symbol('ILessonRepository');

export interface ILessonRepository {
  create(lesson: Lesson): Promise<Lesson>;
  findById(id: string): Promise<Lesson | null>;
}
