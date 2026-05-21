import { QueryResult } from '../../../../../shared/domain/common/query';
import { TutorApplication } from '../../../domain/entities/tutor-application.entity';

export class GetTutorApplicationResult {
  constructor(public readonly result: QueryResult<TutorApplication>) {}
}
