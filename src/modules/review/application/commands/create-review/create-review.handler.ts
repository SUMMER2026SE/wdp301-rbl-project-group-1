import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { BookingStatus } from '../../../../../shared/domain/enums/enums';
import { IReviewRepository } from '../../../domain/repositories/review.repository.interface';
import { CreateReviewCommand } from './create-review.command';
import { CreateReviewResult } from './create-review.result';

@CommandHandler(CreateReviewCommand)
export class CreateReviewHandler
  implements
    ICommandHandler<CreateReviewCommand>,
    ICommand<CreateReviewCommand, CreateReviewResult>
{
  constructor(
    @Inject(IReviewRepository)
    private readonly reviewRepository: IReviewRepository,
  ) {}

  async execute(command: CreateReviewCommand): Promise<CreateReviewResult> {
    if (command.rating < 1 || command.rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    const booking = await this.reviewRepository.findBookingById(
      command.bookingId,
    );
    if (!booking) {
      throw new NotFoundException(
        `Booking with ID ${command.bookingId} not found`,
      );
    }

    if (booking.studentId !== command.studentId) {
      throw new ForbiddenException('You can only review your own booking');
    }

    if (booking.status !== BookingStatus.COMPLETED) {
      throw new BadRequestException('Only completed bookings can be reviewed');
    }

    const existingReview = await this.reviewRepository.findByBookingAndStudent(
      command.bookingId,
      command.studentId,
    );

    if (existingReview) {
      throw new ConflictException('You have already reviewed this booking');
    }

    const review = await this.reviewRepository.create({
      bookingId: command.bookingId,
      tutorId: booking.tutorId,
      studentId: command.studentId,
      rating: command.rating,
      comment: command.comment,
    });

    const stats = await this.reviewRepository.getTutorRatingStats(
      booking.tutorId,
    );
    await this.reviewRepository.updateTutorRating(
      booking.tutorId,
      stats.avgRating,
      stats.totalReviews,
    );

    return new CreateReviewResult(
      review.id,
      review.bookingId,
      review.tutorId,
      review.studentId,
      review.rating,
      review.comment,
      review.createdAt.toISOString(),
    );
  }
}
