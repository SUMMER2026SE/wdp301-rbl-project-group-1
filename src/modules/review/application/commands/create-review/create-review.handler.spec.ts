import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { BookingStatus } from '../../../../../shared/domain/enums/enums';
import { Review } from '../../../domain/entities/review.entity';
import { IReviewRepository } from '../../../domain/repositories/review.repository.interface';
import { CreateReviewCommand } from './create-review.command';
import { CreateReviewHandler } from './create-review.handler';

describe('CreateReviewHandler', () => {
  const baseCommand = new CreateReviewCommand(
    'booking-1',
    'student-1',
    5,
    'Great',
  );

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

  it('throws BadRequestException when rating is out of range', async () => {
    const repository = createRepositoryMock();
    const handler = new CreateReviewHandler(repository);

    await expect(
      handler.execute(
        new CreateReviewCommand('booking-1', 'student-1', 0, null),
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws NotFoundException when booking does not exist', async () => {
    const repository = createRepositoryMock();
    repository.findBookingById.mockResolvedValue(null);
    const handler = new CreateReviewHandler(repository);

    await expect(handler.execute(baseCommand)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('throws ForbiddenException when student does not own booking', async () => {
    const repository = createRepositoryMock();
    repository.findBookingById.mockResolvedValue({
      id: 'booking-1',
      tutorId: 'tutor-1',
      studentId: 'student-2',
      status: BookingStatus.COMPLETED,
    });
    const handler = new CreateReviewHandler(repository);

    await expect(handler.execute(baseCommand)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('throws BadRequestException when booking is not completed', async () => {
    const repository = createRepositoryMock();
    repository.findBookingById.mockResolvedValue({
      id: 'booking-1',
      tutorId: 'tutor-1',
      studentId: 'student-1',
      status: BookingStatus.CONFIRMED,
    });
    const handler = new CreateReviewHandler(repository);

    await expect(handler.execute(baseCommand)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('throws ConflictException when review already exists', async () => {
    const repository = createRepositoryMock();
    repository.findBookingById.mockResolvedValue({
      id: 'booking-1',
      tutorId: 'tutor-1',
      studentId: 'student-1',
      status: BookingStatus.COMPLETED,
    });
    repository.findByBookingAndStudent.mockResolvedValue(
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

    const handler = new CreateReviewHandler(repository);

    await expect(handler.execute(baseCommand)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('creates review and updates tutor rating stats', async () => {
    const updateTutorRatingMock = jest.fn();
    const repository = {
      ...createRepositoryMock(),
      updateTutorRating: updateTutorRatingMock,
    } as jest.Mocked<IReviewRepository>;
    repository.findBookingById.mockResolvedValue({
      id: 'booking-1',
      tutorId: 'tutor-1',
      studentId: 'student-1',
      status: BookingStatus.COMPLETED,
    });
    repository.findByBookingAndStudent.mockResolvedValue(null);
    repository.create.mockResolvedValue(
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
    repository.getTutorRatingStats.mockResolvedValue({
      avgRating: 4.8,
      totalReviews: 10,
    });
    repository.updateTutorRating.mockResolvedValue();

    const handler = new CreateReviewHandler(repository);
    const result = await handler.execute(baseCommand);

    expect(result.id).toBe('review-1');
    expect(result.tutorId).toBe('tutor-1');
    expect(result.createdAt).toBe('2026-01-01T00:00:00.000Z');

    expect(updateTutorRatingMock).toHaveBeenCalledWith('tutor-1', 4.8, 10);
  });
});
