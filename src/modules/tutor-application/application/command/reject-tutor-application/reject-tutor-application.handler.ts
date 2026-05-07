import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler, CommandBus } from '@nestjs/cqrs';
import { SendEmailCommand } from '../../../../notification/application/commands/send-email/send-email.command';
import {
  ConflictException,
  EntityNotFoundException,
} from '../../../../../shared/domain/exceptions/domain-exception';
import { TutorApplicationRepository } from '../../../domain/repositories/tutor-application.repository';
import { RejectTutorApplicationCommand } from './reject-tutor-application.command';
import { RejectTutorApplicationResult } from './reject-tutor-application.result';

@CommandHandler(RejectTutorApplicationCommand)
export class RejectTutorApplicationHandler implements ICommandHandler<
  RejectTutorApplicationCommand,
  RejectTutorApplicationResult
> {
  constructor(
    @Inject(TutorApplicationRepository)
    private readonly tutorApplicationRepository: TutorApplicationRepository,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(
    command: RejectTutorApplicationCommand,
  ): Promise<RejectTutorApplicationResult> {
    const application = await this.tutorApplicationRepository.findById(
      command.id,
    );

    if (!application) {
      throw new EntityNotFoundException('TutorApplication', command.id);
    }

    if (application.status !== 'PENDING') {
      throw new ConflictException(
        `Cannot reject application with status '${application.status}'`,
      );
    }

    application.reject();
    await this.tutorApplicationRepository.update(application);

    // Send email notification
    await this.commandBus.execute(
      new SendEmailCommand(
        application.email,
        'Tutor Application Rejected',
        'tutor-application-rejected',
      ),
    );

    return new RejectTutorApplicationResult(application.id, application.status);
  }
}
