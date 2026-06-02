import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { ITutorRequestRepository } from '../../../domain/repositories/tutor-request.repository.interface';
import { AcceptTutorBidCommand } from './accept-tutor-bid.command';
import { AcceptTutorBidResult } from './accept-tutor-bid.result';

@CommandHandler(AcceptTutorBidCommand)
export class AcceptTutorBidHandler
  implements
    ICommandHandler<AcceptTutorBidCommand>,
    ICommand<AcceptTutorBidCommand, AcceptTutorBidResult>
{
  constructor(
    @Inject(ITutorRequestRepository)
    private readonly tutorRequestRepository: ITutorRequestRepository,
  ) {}

  async execute(command: AcceptTutorBidCommand): Promise<AcceptTutorBidResult> {
    const accepted = await this.tutorRequestRepository.acceptBid({
      requestId: command.requestId,
      bidId: command.bidId,
      studentId: command.studentId,
    });

    if (!accepted) {
      throw new NotFoundException(
        `Pending bid with id ${command.bidId} for open tutor request ${command.requestId} not found`,
      );
    }

    return new AcceptTutorBidResult(
      accepted.bid.id,
      accepted.bid.requestId,
      accepted.bid.tutorId,
      accepted.bid.proposedPrice,
      accepted.bid.message,
      accepted.bid.status,
      accepted.requestStatus,
      accepted.bid.createdAt,
      accepted.bid.updatedAt,
      accepted.bookingId,
    );
  }
}
