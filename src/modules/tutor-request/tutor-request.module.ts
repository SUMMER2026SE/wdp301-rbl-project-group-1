import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AcceptTutorBidHandler } from './application/commands/accept-tutor-bid/accept-tutor-bid.handler';
import { CreateTutorRequestHandler } from './application/commands/create-tutor-request/create-tutor-request.handler';
import { SetTutorBidHandler } from './application/commands/set-tutor-bid/set-tutor-bid.handler';
import { GetTutorRequestQueryHandler } from './application/queries/get-tutor-request/get-tutor-request.handler';
import { ITutorRequestRepository } from './domain/repositories/tutor-request.repository.interface';
import { PrismaTutorRequestRepository } from './infrastructure/repositories/tutor-request.repository.impl';
import { TutorRequestController } from './presentation/controllers/tutor-request.controller';

const CommandHandlers = [
  CreateTutorRequestHandler,
  SetTutorBidHandler,
  AcceptTutorBidHandler,
];

const QueryHandlers = [GetTutorRequestQueryHandler];

@Module({
  imports: [CqrsModule],
  controllers: [TutorRequestController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    {
      provide: ITutorRequestRepository,
      useClass: PrismaTutorRequestRepository,
    },
  ],
  exports: [ITutorRequestRepository],
})
export class TutorRequestModule {}
