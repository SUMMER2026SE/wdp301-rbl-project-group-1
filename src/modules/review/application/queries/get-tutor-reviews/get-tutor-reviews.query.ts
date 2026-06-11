import { FindTutorReviewsParams } from '../../../domain/repositories/review.repository.interface';

export class GetTutorReviewsQuery {
  constructor(public readonly params: FindTutorReviewsParams) {}
}
