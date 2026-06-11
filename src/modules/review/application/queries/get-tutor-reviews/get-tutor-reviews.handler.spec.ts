import { createQueryResult } from '../../../../../shared/domain/common/query';
import { Review } from '../../../domain/entities/review.entity';
import { IReviewRepository } from '../../../domain/repositories/review.repository.interface';
import { GetTutorReviewsHandler } from './get-tutor-reviews.handler';
import { GetTutorReviewsQuery } from './get-tutor-reviews.query';

describe('GetTutorReviewsHandler', () => {
  const createRepositoryMock = (): jest.Mocked<IReviewRepository> =>
    ({
      findBookingById: jest.fn(),
      findByBookingAndStudent: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      findTutorReviews: jest.fn(),
      deleteById: jest.fn(),
      getTutorRatingStats: jest.fn(),
      updateTutorRating: jest.fn(),
    }) as jest.Mocked<IReviewRepository>;

  it('returns mapped review list with pagination meta', async () => {
    const repository = createRepositoryMock();
    const createdAt = new Date('2026-01-01T00:00:00.000Z');

    const params = {
      tutorId: 'tutor-1',
      page: 1,
      limit: 10,
      skip: 0,
      sortBy: 'createdAt',
      sortOrder: 'desc' as const,
    };

    repository.findTutorReviews.mockResolvedValue(
      createQueryResult(
        [
          new Review({
            id: 'review-1',
            bookingId: 'booking-1',
            tutorId: 'tutor-1',
            studentId: 'student-1',
            rating: 5,
            comment: 'Great',
            createdAt,
          }),
          new Review({
            id: 'review-2',
            bookingId: 'booking-2',
            tutorId: 'tutor-1',
            studentId: 'student-2',
            rating: 4,
            comment: null,
            createdAt,
            student: {
              id: 'student-2',
              nickname: 'An',
              avatarUrl: null,
            },
          }),
        ],
        2,
        params,
      ),
    );

    const handler = new GetTutorReviewsHandler(repository);
    const result = await handler.execute(new GetTutorReviewsQuery(params));

    expect(result.total).toBe(2);
    expect(result.totalPages).toBe(1);

    expect(result.data[0].student.id).toBe('student-1');
    expect(result.data[0].student.nickname).toBeNull();

    expect(result.data[1].student.id).toBe('student-2');
    expect(result.data[1].student.nickname).toBe('An');
  });
});
