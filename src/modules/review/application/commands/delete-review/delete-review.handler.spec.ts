import { NotFoundException } from '@nestjs/common';
import { Review } from '../../../domain/entities/review.entity';
import { IReviewRepository } from '../../../domain/repositories/review.repository.interface';
import { DeleteReviewCommand } from './delete-review.command';
import { DeleteReviewHandler } from './delete-review.handler';

describe('DeleteReviewHandler', () => {
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

  it('throws NotFoundException when review does not exist', async () => {
    const repository = createRepositoryMock();
    repository.findById.mockResolvedValue(null);

    const handler = new DeleteReviewHandler(repository);

    await expect(
      handler.execute(new DeleteReviewCommand('review-1')),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('throws NotFoundException when deleteById returns false', async () => {
    const repository = createRepositoryMock();
    repository.findById.mockResolvedValue(
      new Review({
        id: 'review-1',
        bookingId: 'booking-1',
        tutorId: 'tutor-1',
        studentId: 'student-1',
        rating: 5,
        comment: 'Great',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
      }),
    );
    repository.deleteById.mockResolvedValue(false);

    const handler = new DeleteReviewHandler(repository);

    await expect(
      handler.execute(new DeleteReviewCommand('review-1')),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('deletes review and updates tutor rating stats', async () => {
    const updateTutorRatingMock = jest.fn();
    const repository = {
      ...createRepositoryMock(),
      updateTutorRating: updateTutorRatingMock,
    } as jest.Mocked<IReviewRepository>;
    repository.findById.mockResolvedValue(
      new Review({
        id: 'review-1',
        bookingId: 'booking-1',
        tutorId: 'tutor-1',
        studentId: 'student-1',
        rating: 5,
        comment: 'Great',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
      }),
    );
    repository.deleteById.mockResolvedValue(true);
    repository.getTutorRatingStats.mockResolvedValue({
      avgRating: 4.2,
      totalReviews: 7,
    });
    repository.updateTutorRating.mockResolvedValue();

    const handler = new DeleteReviewHandler(repository);
    const result = await handler.execute(new DeleteReviewCommand('review-1'));

    expect(result.reviewId).toBe('review-1');
    expect(updateTutorRatingMock).toHaveBeenCalledWith('tutor-1', 4.2, 7);
  });
});
