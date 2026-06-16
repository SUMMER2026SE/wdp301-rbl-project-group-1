import { BadRequestException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { ITutorRequestRepository } from '../../../domain/repositories/tutor-request.repository.interface';
import { CreateTutorRequestCommand } from './create-tutor-request.command';
import { CreateTutorRequestResult } from './create-tutor-request.result';
import { EventBus } from '@nestjs/cqrs';
import { TutorRequestCreatedEvent } from '../../../domain/events/tutor-request-events';

@CommandHandler(CreateTutorRequestCommand)
export class CreateTutorRequestHandler
  implements
    ICommandHandler<CreateTutorRequestCommand>,
    ICommand<CreateTutorRequestCommand, CreateTutorRequestResult>
{
  constructor(
    @Inject(ITutorRequestRepository)
    private readonly tutorRequestRepository: ITutorRequestRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(
    command: CreateTutorRequestCommand,
  ): Promise<CreateTutorRequestResult> {
    this.validateNoDuplicateScheduleRules(command.scheduleRules ?? []);

    const request = await this.tutorRequestRepository.createRequest({
      studentId: command.studentId,
      subjectId: command.subjectId,
      gradeId: command.gradeId,
      title: command.title,
      description: command.description,
      mode: command.mode,
      budget: command.budget,
      totalSessions: command.totalSessions,
      scheduleRules: command.scheduleRules,
    });

    const result = new CreateTutorRequestResult(
      request.id,
      request.studentId,
      request.subjectId,
      request.gradeId,
      request.title,
      request.description,
      request.mode,
      request.budget,
      request.status,
      request.totalSessions,
      request.createdAt,
    );

    this.eventBus.publish(
      new TutorRequestCreatedEvent(
        request.id,
        request.studentId,
        request.subjectId ?? '',
        request.title,
      ),
    );

    return result;
  }

  private validateNoDuplicateScheduleRules(
    scheduleRules: CreateTutorRequestCommand['scheduleRules'],
  ): void {
    const seen = new Set<string>();

    for (const rule of scheduleRules ?? []) {
      const key = `${rule.dayOfWeek}:${rule.startTime}:${rule.endTime}`;
      if (seen.has(key)) {
        throw new BadRequestException('Duplicate schedule rule');
      }
      seen.add(key);
    }
  }
}
