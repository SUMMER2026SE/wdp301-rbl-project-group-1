import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { IReviewRepository } from '../../../domain/repositories/review.repository.interface';
import { DeleteReviewCommand } from './delete-review.command';
import { DeleteReviewResult } from './delete-review.result';

@CommandHandler(DeleteReviewCommand)
export class DeleteReviewHandler
  implements
    ICommandHandler<DeleteReviewCommand>,
    ICommand<DeleteReviewCommand, DeleteReviewResult>
{
  constructor(
    @Inject(IReviewRepository)
    private readonly reviewRepository: IReviewRepository,
  ) {}

  async execute(command: DeleteReviewCommand): Promise<DeleteReviewResult> {
    const review = await this.reviewRepository.findById(command.reviewId);
    if (!review) {
      throw new NotFoundException(
        `Review with ID ${command.reviewId} not found`,
      );
    }

    const deleted = await this.reviewRepository.deleteById(command.reviewId);
    if (!deleted) {
      throw new NotFoundException(
        `Review with ID ${command.reviewId} not found`,
      );
    }

    const stats = await this.reviewRepository.getTutorRatingStats(
      review.tutorId,
    );
    await this.reviewRepository.updateTutorRating(
      review.tutorId,
      stats.avgRating,
      stats.totalReviews,
    );

    return new DeleteReviewResult(command.reviewId);
  }
}
