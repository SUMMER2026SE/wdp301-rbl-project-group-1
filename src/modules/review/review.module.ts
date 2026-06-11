import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateReviewHandler } from './application/commands/create-review/create-review.handler';
import { DeleteReviewHandler } from './application/commands/delete-review/delete-review.handler';
import { GetTutorReviewsHandler } from './application/queries/get-tutor-reviews/get-tutor-reviews.handler';
import { IReviewRepository } from './domain/repositories/review.repository.interface';
import { PrismaReviewRepository } from './infrastructure/repositories/review.repository.impl';
import { ReviewController } from './presentation/controllers/review.controller';

const CommandHandlers = [CreateReviewHandler, DeleteReviewHandler];
const QueryHandlers = [GetTutorReviewsHandler];

@Module({
  imports: [CqrsModule],
  controllers: [ReviewController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    {
      provide: IReviewRepository,
      useClass: PrismaReviewRepository,
    },
  ],
  exports: [IReviewRepository],
})
export class ReviewModule {}
