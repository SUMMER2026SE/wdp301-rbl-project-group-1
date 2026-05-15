import {
  QueryParams,
  QueryResult,
} from '../../../../shared/domain/common/query';
import { type Resource } from '../entities/resource.entity';

export type AssignTarget = 'COURSE' | 'LESSON';

export interface ResourcePaginatedParams extends QueryParams {
  userId: string;
}

export const IResourceRepository = Symbol('IResourceRepository');

export interface IResourceRepository {
  create(resource: Resource): Promise<Resource>;
  findById(id: string): Promise<Resource | null>;
  findAll(): Promise<Resource[]>;
  findByTarget(targetType: AssignTarget, targetId: string): Promise<Resource[]>;
  findByUserId(params: ResourcePaginatedParams): Promise<QueryResult<Resource>>;
  assignToCourse(resourceId: string, courseId: string): Promise<void>;
  assignToLesson(resourceId: string, lessonId: string): Promise<void>;
}
