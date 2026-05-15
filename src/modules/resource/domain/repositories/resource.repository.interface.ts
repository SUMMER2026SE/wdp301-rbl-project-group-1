import { type Resource } from '../entities/resource.entity';

export type AssignTarget = 'COURSE' | 'LESSON';

export const IResourceRepository = Symbol('IResourceRepository');

export interface IResourceRepository {
  create(resource: Resource): Promise<Resource>;
  findById(id: string): Promise<Resource | null>;
  assignToCourse(resourceId: string, courseId: string): Promise<void>;
  assignToLesson(resourceId: string, lessonId: string): Promise<void>;
}
