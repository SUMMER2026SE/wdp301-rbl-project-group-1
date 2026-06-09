import {
  QueryParams,
  QueryResult,
} from '../../../../shared/domain/common/query';
import { Tutor } from '../entities/tutor.entity';

export interface TutorPaginatedParams extends QueryParams {
  specialization?: string;
  minPrice?: number;
  maxPrice?: number;
  subjectIds?: string[];
  gradeIds?: string[];
}

export interface TutorWithProfile {
  tutor: Tutor;
  profile: {
    nickname: string | null;
    avatarUrl: string | null;
  };
}

export const ITutorRepository = Symbol('ITutorRepository');
export interface ITutorRepository {
  findByUserId(userId: string): Promise<Tutor | null>;
  findAll(params: TutorPaginatedParams): Promise<QueryResult<TutorWithProfile>>;
  save(tutor: Tutor): Promise<void>;
}
