import {
  QueryParams,
  QueryResult,
} from '../../../../shared/domain/common/query';
import { TutorApplication } from '../entities/tutor-application.entity';
import { TutorApplicationStatus } from '../enums/tutor-application';

export type FindTutorApplicationsParams = QueryParams & {
  status?: TutorApplicationStatus;
};

export const ITutorApplicationRepository = Symbol(
  'ITutorApplicationRepository',
);

export abstract class TutorApplicationRepository {
  abstract create(application: TutorApplication): Promise<TutorApplication>;

  abstract findByEmail(email: string): Promise<TutorApplication | null>;

  abstract findById(id: string): Promise<TutorApplication | null>;

  abstract update(application: TutorApplication): Promise<TutorApplication>;

  abstract findAll(
    params: FindTutorApplicationsParams,
  ): Promise<QueryResult<TutorApplication>>;
}
