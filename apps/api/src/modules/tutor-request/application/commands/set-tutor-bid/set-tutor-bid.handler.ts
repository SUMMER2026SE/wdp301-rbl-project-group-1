import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { ITutorRequestRepository } from '../../../domain/repositories/tutor-request.repository.interface';
import { SetTutorBidCommand } from './set-tutor-bid.command';
import { SetTutorBidResult } from './set-tutor-bid.result';

@CommandHandler(SetTutorBidCommand)
export class SetTutorBidHandler
  implements
    ICommandHandler<SetTutorBidCommand>,
    ICommand<SetTutorBidCommand, SetTutorBidResult>
{
  constructor(
    @Inject(ITutorRequestRepository)
    private readonly tutorRequestRepository: ITutorRequestRepository,
  ) {}

  async execute(command: SetTutorBidCommand): Promise<SetTutorBidResult> {
    const request = await this.tutorRequestRepository.findOpenRequestById(
      command.requestId,
    );

    if (!request) {
      throw new NotFoundException(
        `Open tutor request with id ${command.requestId} not found`,
      );
    }

    const bid = await this.tutorRequestRepository.setBid({
      requestId: command.requestId,
      tutorId: command.tutorId,
      proposedPrice: command.proposedPrice,
      message: command.message,
    });

    return new SetTutorBidResult(
      bid.id,
      bid.requestId,
      bid.tutorId,
      bid.proposedPrice,
      bid.message,
      bid.status,
      bid.createdAt,
      bid.updatedAt,
    );
  }
}
