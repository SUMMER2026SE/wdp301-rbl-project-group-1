import { TutorPaginatedParams } from '../../../domain/repositories/tutor.repository.interface';

export class GetTutorsQuery {
  constructor(public readonly params: TutorPaginatedParams) {}
}
