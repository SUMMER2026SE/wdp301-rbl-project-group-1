import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { LessonStatus } from '../../../../../shared/domain/enums/enums';
import { Lesson } from '../../../domain/entities/lesson.entity';
import { ILessonMeetingService } from '../../../domain/interfaces/meeting-service.interface';
import { ILessonRepository } from '../../../domain/repositories/lesson.repository.interface';
import { CreateLessonCommand } from './create-lesson.command';
import { CreateLessonResult } from './create-lesson.result';

@CommandHandler(CreateLessonCommand)
export class CreateLessonCommandHandler
  implements
    ICommandHandler<CreateLessonCommand>,
    ICommand<CreateLessonCommand, CreateLessonResult>
{
  private readonly logger = new Logger(CreateLessonCommandHandler.name);

  constructor(
    @Inject(ILessonRepository)
    private readonly lessonRepository: ILessonRepository,
    @Inject(ILessonMeetingService)
    private readonly meetingService: ILessonMeetingService,
  ) {}

  async execute(command: CreateLessonCommand): Promise<CreateLessonResult> {
    const id = randomUUID();

    let finalMeetingUrl = command.meetingUrl;

    if (!finalMeetingUrl) {
      try {
        const meetingResult = await this.meetingService.createMeetingForLesson(
          command.tutorId,
          command.title,
          command.startTime,
          command.endTime,
        );
        finalMeetingUrl = meetingResult.meetingUrl;
      } catch (error) {
        this.logger.warn(
          'Could not auto-generate Meeting URL, leaving it empty.',
          error instanceof Error ? error.message : error,
        );
      }
    }

    const lesson = Lesson.create(id, {
      courseId: command.courseId,
      title: command.title,
      content: command.content,
      meetingUrl: finalMeetingUrl,
      videoUrl: command.videoUrl,
      startTime: command.startTime,
      endTime: command.endTime,
      orderIndex: command.orderIndex,
      status: command.status ?? LessonStatus.SCHEDULED,
      createdAt: new Date(),
    });

    const saved = await this.lessonRepository.create(lesson);

    return new CreateLessonResult(saved.id);
  }
}
