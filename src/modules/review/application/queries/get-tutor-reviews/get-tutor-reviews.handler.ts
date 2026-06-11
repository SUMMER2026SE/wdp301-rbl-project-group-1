import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  createQueryResult,
  QueryResult,
} from '../../../../../shared/domain/common/query';
import { IReviewRepository } from '../../../domain/repositories/review.repository.interface';
import { GetTutorReviewsQuery } from './get-tutor-reviews.query';
import { ReviewResultData } from './get-tutor-reviews.result';

@QueryHandler(GetTutorReviewsQuery)
export class GetTutorReviewsHandler implements IQueryHandler<GetTutorReviewsQuery> {
  constructor(
    @Inject(IReviewRepository)
    private readonly reviewRepository: IReviewRepository,
  ) {}

  async execute(
    query: GetTutorReviewsQuery,
  ): Promise<QueryResult<ReviewResultData>> {
    const result = await this.reviewRepository.findTutorReviews(query.params);

    const data: ReviewResultData[] = result.data.map((review) => ({
      id: review.id,
      bookingId: review.bookingId,
      tutorId: review.tutorId,
      studentId: review.studentId,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      student: {
        id: review.student?.id ?? review.studentId,
        nickname: review.student?.nickname ?? null,
        avatarUrl: review.student?.avatarUrl ?? null,
      },
    }));

    return createQueryResult(data, result.total, query.params);
  }
}
