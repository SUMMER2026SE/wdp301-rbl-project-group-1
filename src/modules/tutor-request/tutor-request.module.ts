import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateTutorRequestHandler } from './application/commands/create-tutor-request/create-tutor-request.handler';
import { SetTutorBidHandler } from './application/commands/set-tutor-bid/set-tutor-bid.handler';
import { ITutorRequestRepository } from './domain/repositories/tutor-request.repository.interface';
import { PrismaTutorRequestRepository } from './infrastructure/repositories/tutor-request.repository.impl';
import { TutorRequestController } from './presentation/controllers/tutor-request.controller';

const CommandHandlers = [CreateTutorRequestHandler, SetTutorBidHandler];

@Module({
  imports: [CqrsModule],
  controllers: [TutorRequestController],
  providers: [
    ...CommandHandlers,
    {
      provide: ITutorRequestRepository,
      useClass: PrismaTutorRequestRepository,
    },
  ],
  exports: [ITutorRequestRepository],
})
export class TutorRequestModule {}
